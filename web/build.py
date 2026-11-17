import json
# GymTrack runs inside Terra in its own frame; its page is carried as one string
GYM='const GYM_HTML = '+json.dumps(open('gymtrack.html').read()).replace('</','<\\/')+';\n'+open('gym.js').read()
s=open('shell.html').read()
s=s.replace('/*CSS*/',open('style.css').read()).replace('/*CHARS*/',open('chars2.js').read()+'\n'+open('chars3.js').read()).replace('/*APP*/',open('i18n.js').read()+'\n'+open('art.js').read()+'\n'+open('track.js').read()+'\n'+open('body.js').read()+'\n'+open('tour.js').read()+'\n'+open('app.js').read()+'\n'+open('push.js').read()+'\n'+GYM)
open('terra.html','w').write(s)
# local test wrapper with doctype
open('test.html','w').write('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'+s+'</body></html>')
# iOS app page (WKWebView loads this file directly, so it needs its own doctype, charset and viewport)
open('ios.html','w').write('<!doctype html>\n<html lang="fi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\n<meta name="color-scheme" content="dark">\n<style>html{-webkit-text-size-adjust:100%;text-size-adjust:100%}body{margin:0}[hidden]{display:none!important}html .app{padding-top:calc(18px + var(--sai-top))}html body::before{height:calc(var(--sai-top) + 18px);background:linear-gradient(to bottom,rgba(7,6,11,.75),rgba(7,6,11,.45) 60%,rgba(7,6,11,0))}</style>\n</head>\n<body>\n'+s+'\n</body>\n</html>\n')

# Hosted web app (Cloudflare Worker serves it from server/public): installable, with push reminders
import os
pub=os.path.join('..','server','public') if os.path.isdir(os.path.join('..','server','public')) else None
if pub:
    head='<!DOCTYPE html>\n<html lang="fi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="theme-color" content="#0e1320">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="apple-mobile-web-app-title" content="Terra">\n<link rel="manifest" href="/manifest.webmanifest">\n<link rel="apple-touch-icon" href="/icon-180.png">\n<link rel="icon" href="/icon-192.png">\n<script>window.TERRA_HOSTED=true</script>\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>\n'
    open(os.path.join(pub,'index.html'),'w').write(head+s)

# The iPhone app loads the same page from its bundle
if os.path.isdir(os.path.join('..','ios','Terra')):
    import shutil; shutil.copy('ios.html', os.path.join('..','ios','Terra','index.html'))
