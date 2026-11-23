/* ============ CÀI ĐẶT – SỬA Ở ĐÂY ============ */
const WHATSAPP = '491621814413';                 // số WhatsApp (mã nước 49, bỏ số 0 đầu)
const FACEBOOK = 'https://www.facebook.com/';    // TODO: dán link trang Facebook của tiệm

/* Giờ mở cửa: [giờ mở, giờ đóng], null = nghỉ. 0 = Chủ nhật */
const HOURS = {1:[9,20],2:[9,20],3:[9,20],4:[9,20],5:[9,20],6:[9,20],0:null};

/* Dịch vụ & giá (GIÁ TẠM – sửa lại cho đúng)
   color = màu viền danh mục; mỗi dịch vụ: name, desc (mô tả, có thể bỏ trống), min (phút), price (€) */
const SERVICES = [
  {cat:{de:'Maniküre',en:'Manicure'}, color:'#3b82f6', items:[
    {name:{de:'Maniküre klassisch',en:'Classic manicure'}, desc:{de:'• Handbad\n• Nägel kürzen und feilen\n• Sanftes Entfernen der Nagelhaut\n• Pflegeöl',en:'• Hand bath\n• Nail cutting and filing\n• Gentle cuticle removal\n• Care oil'}, min:30, price:20},
    {name:{de:'Deluxe Maniküre',en:'Deluxe manicure'}, desc:{de:'• Handbad\n• Nägel kürzen und feilen\n• Nagelhautpflege\n• Handmaske\n• Entspannende Massage (Unterarme & Hände)',en:'• Hand bath\n• Nail cutting and filing\n• Cuticle care\n• Hand mask\n• Relaxing massage (forearms & hands)'}, min:45, price:30},
    {name:{de:'Maniküre mit Shellac',en:'Manicure with shellac'}, min:50, price:35}]},
  {cat:{de:'Gel / Acryl',en:'Gel / Acrylic'}, color:'#ec4899', items:[
    {name:{de:'Neumodellage Gel',en:'New set gel'}, min:75, price:40},
    {name:{de:'Neumodellage Acryl',en:'New set acrylic'}, min:75, price:42},
    {name:{de:'Auffüllen Gel / Acryl',en:'Refill gel / acrylic'}, min:60, price:33},
    {name:{de:'Babyboomer / Ombre',en:'Babyboomer / ombre'}, min:90, price:48},
    {name:{de:'French',en:'French'}, min:80, price:45}]},
  {cat:{de:'Shellac',en:'Shellac'}, color:'#8b5cf6', items:[
    {name:{de:'Shellac Hände',en:'Shellac hands'}, min:40, price:28},
    {name:{de:'Shellac Füße',en:'Shellac toes'}, min:30, price:22},
    {name:{de:'Shellac entfernen',en:'Shellac removal'}, min:15, price:10}]},
  {cat:{de:'Nail Art',en:'Nail art'}, color:'#3b82f6', items:[
    {name:{de:'Nail Art pro Nagel',en:'Nail art per nail'}, min:5, price:2},
    {name:{de:'Steinchen / Glitzer pro Nagel',en:'Stones / glitter per nail'}, min:5, price:1}]},
  {cat:{de:'Pediküre',en:'Pedicure'}, color:'#10b981', items:[
    {name:{de:'Pediküre klassisch',en:'Classic pedicure'}, desc:{de:'• Fußbad\n• Nägel kürzen und feilen\n• Hornhautentfernung\n• Pflegecreme',en:'• Foot bath\n• Nail cutting and filing\n• Callus removal\n• Care cream'}, min:40, price:28},
    {name:{de:'Spa-Pediküre',en:'Spa pedicure'}, desc:{de:'• Fußbad\n• Peeling\n• Hornhautentfernung\n• Fußmaske\n• Entspannende Massage',en:'• Foot bath\n• Scrub\n• Callus removal\n• Foot mask\n• Relaxing massage'}, min:60, price:38},
    {name:{de:'Spa-Pediküre mit Shellac',en:'Spa pedicure with shellac'}, min:75, price:48}]},
  {cat:{de:'Wimpern',en:'Eyelash'}, color:'#f59e0b', items:[
    {name:{de:'Wimpernverlängerung 1:1 Neu',en:'Classic lash extensions (new)'}, min:90, price:59},
    {name:{de:'Volumen Wimpern Neu',en:'Volume lashes (new)'}, min:120, price:79},
    {name:{de:'Wimpern auffüllen',en:'Lash refill'}, min:60, price:39},
    {name:{de:'Wimpernlifting',en:'Lash lift'}, min:45, price:45}]},
  {cat:{de:'Brauen',en:'Brows'}, color:'#f97316', items:[
    {name:{de:'Brauen zupfen',en:'Brow shaping'}, min:15, price:10},
    {name:{de:'Brauen färben',en:'Brow tint'}, min:15, price:12},
    {name:{de:'Brauen Lifting + Färben',en:'Brow lamination + tint'}, min:45, price:40}]},
];

/* ---------- ĐỊA CHỈ & BẢN ĐỒ ---------- */
const ADDRESS = 'Kaiserstraße 54A, 66849 Landstuhl';      // địa chỉ hiển thị + dùng cho bản đồ Google

/* ---------- ĐÁNH GIÁ ----------
   GOOGLE_REVIEW_URL: link "Viết đánh giá" của tiệm trên Google
     (Google Business Profile → "Ask for reviews / Nach Rezensionen fragen" → copy link)
   GOOGLE_REVIEWS_ALL: link xem tất cả đánh giá trên Google Maps
   Để trống '' thì nút tương ứng tự ẩn. */
const GOOGLE_REVIEW_URL  = '';
const GOOGLE_REVIEWS_ALL = '';

/* Điểm CHÍNH THỨC trên Google Maps (tùy chọn).
   Chép đúng số đang hiện trên trang Google của tiệm, ví dụ: { score: 4.9, count: 57 }
   Để null thì website tự tính điểm từ danh sách REVIEWS bên dưới. */
const GOOGLE_RATING = { score: 4.9, count: 57 };

/* Dán đánh giá THẬT của khách (copy từ Google / Facebook). Mỗi đánh giá:
   {
     name:  'Tên khách',
     stars: 5,                         // 1–5
     date:  '2026-11-20',              // năm-tháng-ngày
     text:  'Nội dung khách viết',
     source:'Google',                  // 'Google' | 'Facebook' | '' (nhãn nhỏ cạnh tên)
     link:  'https://...',             // (tuỳ chọn) link tới đánh giá gốc
     reply: { date:'2026-11-21', text:'Câu trả lời của tiệm' }   // (tuỳ chọn) bỏ đi nếu chưa trả lời
   }
   sample:true = dữ liệu mẫu, hiện nhãn "Beispiel" – XÓA các dòng mẫu khi có đánh giá thật. */
const REVIEWS = [
  {name:'Beispiel A', stars:5, date:'2026-11-20', source:'Google', sample:true,
   text:'Hier steht später eine echte Kundenbewertung – z. B. aus Google kopiert.',
   reply:{date:'2026-11-21', text:'Hier steht die Antwort des Studios auf die Bewertung.'}},
  {name:'Beispiel B', stars:5, date:'2026-11-12', source:'Google', sample:true,
   text:'Platzhalter für eine echte Bewertung zum Nageldesign.',
   reply:{date:'2026-11-13', text:'Platzhalter für die Antwort des Studios.'}},
  {name:'Beispiel C', stars:4, date:'2026-10-30', source:'Facebook', sample:true,
   text:'Platzhalter für eine echte Bewertung ohne Antwort.'},
];
const PAGE = 6;   // số đánh giá hiển thị mỗi lần bấm "Xem thêm"
/* ============================================ */
