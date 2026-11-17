#!/usr/bin/env python3
"""Validador SOLO ESTRUCTURAL; no evalúa retención, historia, originalidad ni calidad."""
import json,sys
from pathlib import Path
p=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]/'templates'/'brief-torre-pisa-7min.json'
errors=[]
try: d=json.loads(p.read_text(encoding='utf-8'))
except Exception as e: print('ERROR lectura:',e);sys.exit(2)
for key in ('project','episode_id','format','target_seconds','controlling_idea','hooks','segments','claims','approval'):
 if not d.get(key):errors.append('falta '+key)
ss=d.get('segments',[])
if len(ss)!=8:errors.append('se esperaban 8 segmentos en esta plantilla')
for i,s in enumerate(ss):
 for k in ('id','start_seconds','end_seconds','question','payoff','visual_object','factual_status'):
  if k not in s or s[k] in ('',None):errors.append(f'segmento {i+1} sin {k}')
 if not isinstance(s.get('start_seconds'),(int,float)) or not isinstance(s.get('end_seconds'),(int,float)):continue
 if s['end_seconds']<=s['start_seconds']:errors.append(f'segmento {i+1} duración inválida')
 if i and s['start_seconds']!=ss[i-1]['end_seconds']:errors.append(f'segmento {i+1} no conecta con anterior')
if ss and ss[0].get('start_seconds')!=0:errors.append('el primer segmento no inicia en cero')
if ss and ss[-1].get('end_seconds')!=d.get('target_seconds'):errors.append('duración final no coincide con objetivo')
for c in d.get('claims',[]):
 if not c.get('id') or not c.get('status') or not c.get('source'):errors.append('afirmación sin id/status/source')
if any(d.get('approval',{}).values()):errors.append('plantilla de auditoría no puede marcar aprobado')
if errors:
 print('NO VALIDÓ:' + chr(10) + ' - ' + (chr(10) + ' - ').join(errors))
 sys.exit(1)
print('OK: estructura de brief, tiempos y campos declarados. NO se verificaron hechos ni calidad.')
