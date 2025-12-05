// server/data/ads.ts — ahora con tamaños ideales por placement
export default [
  // Arriba (pequeño)
  { id:'ct-1', placement:'content-top', title:'Banner Top', href:'https://example.com/top',
    image:'https://placehold.co/468x60?text=Top+468x60', width:468, height:60 },

  // Centro (pequeño)
  { id:'bp-1', placement:'between-panels', title:'Banner Middle', href:'https://example.com/mid',
    image:'https://placehold.co/468x60?text=Middle+468x60', width:468, height:60 },

  // Sidebar (rectángulo mediano)
  { id:'side-1', placement:'sidebar', title:'Banner Sidebar', href:'https://example.com/side',
    image:'https://placehold.co/300x250?text=Sidebar+300x250', width:300, height:250 },

  // Abajo (grandes)
  { id:'hdr-1', placement:'header', title:'Banner Bottom Large A', href:'https://example.com/big1',
    image:'https://placehold.co/728x90?text=Bottom+728x90', width:728, height:90 },
  { id:'ftr-1', placement:'footer', title:'Banner Bottom Large B', href:'https://example.com/big2',
    image:'https://placehold.co/970x90?text=Bottom+970x90', width:970, height:90 },
]
