#!/usr/bin/env python3
"""Controlla https://www.scuolacalo.edu.it/circolare/ e avvisa se compaiono
nuove circolari per la Deledda o per tutte le scuole di Ginosa, con
evidenza particolare per le classi quarte.

Solo libreria standard (Python 3.5+), adatto a un eeepc.
Config: variabili d'ambiente o file config.env nella stessa cartella.
"""
import html.parser, json, os, re, smtplib, subprocess, sys, time
import urllib.request, urllib.parse
from email.message import EmailMessage

BASE = "https://www.scuolacalo.edu.it/circolare/"
HERE = os.path.dirname(os.path.abspath(__file__))
STATE = os.path.join(HERE, "seen.json")
PAGES = 2  # quante pagine di elenco guardare (/circolare/page/N/)

# --- criteri -----------------------------------------------------------
RE_SCUOLA = re.compile(r"deledda|ginosa|tutti i plessi|tutte le scuole", re.I)
RE_QUARTE = re.compile(
    r"class[ei]\s+(4|iv|quart)|\b4\s*[\^°ªa]?\s*[A-F]\b|\bquart[ae]\b|\b4\s*[\^°ª]", re.I)


def load_config():
    p = os.path.join(HERE, "config.env")
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"\''))


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 circolari-watch"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
        enc = r.headers.get_content_charset() or "utf-8"
    return data.decode(enc, "replace")


class Links(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self._href, self._txt = [], None, []
    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self._href, self._txt = dict(attrs).get("href"), []
    def handle_data(self, d):
        if self._href is not None:
            self._txt.append(d)
    def handle_endtag(self, tag):
        if tag == "a" and self._href:
            self.links.append((self._href, " ".join("".join(self._txt).split())))
            self._href = None


class Text(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.out, self.skip = [], 0
    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "nav", "footer", "header"):
            self.skip += 1
    def handle_endtag(self, tag):
        if tag in ("script", "style", "nav", "footer", "header") and self.skip:
            self.skip -= 1
    def handle_data(self, d):
        if not self.skip:
            self.out.append(d)


def text_of(page):
    t = Text(); t.feed(page)
    return " ".join(" ".join(t.out).split())


def list_circolari():
    found = {}
    for n in range(1, PAGES + 1):
        url = BASE if n == 1 else BASE + "page/%d/" % n
        try:
            p = Links(); p.feed(fetch(url))
        except Exception as e:
            if n == 1:
                raise
            break
        for href, title in p.links:
            full = urllib.parse.urljoin(url, href).split("#")[0]
            path = urllib.parse.urlparse(full).path
            # dettaglio: /circolare/<slug>/ (non l'elenco, non la paginazione)
            if path.startswith("/circolare/") and path.rstrip("/") != "/circolare" \
                    and "/page/" not in path and title:
                found.setdefault(full, title)
    return found


def notify(subject, body):
    print("== " + subject + "\n" + body)
    ok = False
    # 1) email
    host, to = os.environ.get("SMTP_HOST"), os.environ.get("MAIL_TO")
    if host and to:
        try:
            m = EmailMessage()
            m["Subject"], m["From"], m["To"] = subject, os.environ.get("SMTP_USER", to), to
            m.set_content(body)
            port = int(os.environ.get("SMTP_PORT", "587"))
            s = smtplib.SMTP(host, port, timeout=30); s.starttls()
            if os.environ.get("SMTP_USER"):
                s.login(os.environ["SMTP_USER"], os.environ.get("SMTP_PASS", ""))
            s.send_message(m); s.quit(); ok = True
        except Exception as e:
            print("email fallita:", e, file=sys.stderr)
    # 2) push sul telefono via ntfy.sh (app gratuita "ntfy")
    topic = os.environ.get("NTFY_TOPIC")
    if topic:
        try:
            req = urllib.request.Request("https://ntfy.sh/" + topic,
                data=body.encode("utf-8"), headers={"Title": subject.encode("utf-8").decode("latin-1", "replace"),
                "Priority": "high"})
            urllib.request.urlopen(req, timeout=30); ok = True
        except Exception as e:
            print("ntfy fallita:", e, file=sys.stderr)
    # 3) notifica locale, se c'è un desktop
    try:
        subprocess.call(["notify-send", subject, body])
    except Exception:
        pass
    return ok


def main():
    load_config()
    seen = json.load(open(STATE)) if os.path.exists(STATE) else None
    first_run = seen is None
    seen = seen or {}
    hits = []
    for url, title in list_circolari().items():
        if url in seen:
            continue
        try:
            body = text_of(fetch(url))
        except Exception as e:
            print("skip", url, e, file=sys.stderr); continue  # riprova al giro dopo
        blob = title + " " + body
        seen[url] = {"title": title, "date": time.strftime("%F")}
        if RE_SCUOLA.search(blob):
            hits.append((bool(RE_QUARTE.search(blob)), title, url))
        time.sleep(1)
    json.dump(seen, open(STATE, "w"), indent=1, ensure_ascii=False)

    if first_run:
        print("Prima esecuzione: %d circolari registrate come già viste." % len(seen))
        print("Pertinenti già presenti: %d (non notificate)" % len(hits))
        for q, t, u in hits:
            print(("[CLASSI 4] " if q else "          ") + t + "\n   " + u)
        return
    if hits:
        hits.sort(key=lambda h: not h[0])
        q4 = any(h[0] for h in hits)
        subj = ("[CLASSI 4] " if q4 else "") + "Nuove circolari Calò: %d pertinenti" % len(hits)
        notify(subj, "\n\n".join(("CLASSI 4 - " if q else "") + t + "\n" + u for q, t, u in hits))


if __name__ == "__main__":
    main()
