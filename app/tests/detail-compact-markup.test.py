from pathlib import Path
from html.parser import HTMLParser
import unittest
p=Path(__file__).resolve().parents[2]/'app'
class Tree(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.ids={}
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs);identifier=attrs.get('id');node={'tag':tag,'attrs':attrs,'parent':self.stack[-1] if self.stack else None}
  if identifier:
   assert identifier not in self.ids,identifier
   self.ids[identifier]=node
  if tag not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:self.stack.append(node)
 def handle_endtag(self,tag):
  assert self.stack and self.stack[-1]['tag']==tag,(tag,[n['tag'] for n in self.stack[-4:]])
  self.stack.pop()
class DetailMarkup(unittest.TestCase):
 def test_balanced_detail_ownership_and_disclosure(self):
  t=Tree();s=(p/'index.html').read_text();start=s.index('<aside id="detail"');end=s.index('</aside>',start)+8;t.feed(s[start:end]);assert not t.stack
  ids=t.ids
  for name in ids['detail-expand']['attrs']['aria-controls'].split():assert name in ids
  assert ids['detail-title']['attrs']['tabindex']=='-1'
  assert ids['detail-expand']['attrs']['aria-expanded']=='true'
  assert 'hidden' in ids['detail-expand']['attrs']
  for name,parent in [('detail-summary','detail-overview'),('walk-here','detail-information'),('reference-gallery','detail-information'),('front-view','detail'),('side-view','detail'),('back-view','detail'),('roof-view','detail')]:
   node=ids[name]['parent']
   while node and node['attrs'].get('id')!=parent:node=node['parent']
   assert node,(name,parent)

if __name__=='__main__':unittest.main()
