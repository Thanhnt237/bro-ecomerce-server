const script_db = require("../../config/script_db");
let connection = require("../../config/database_connection");
const constants = require("../../common/constants")
const { request, gql , GraphQLClient} = require('graphql-request');
const multerUpload = require('../multer');
const multer = require('multer')
const paypal = require('../../config/paypal')
const tensor = require('../../tensorflow/index')

module.exports = {
  initDatabase: initDatabase,
  convertGPL: convertGPL,
  uploadFile: uploadFile,
  createPaypalSDK: createPaypalSDK,
  predictProduct: predictProduct,
  testPredict: testPredict
};

async function initDatabase(req, res) {
  let string_script = script_db; //.replace(/\n/g, ' ');
  string_script = string_script.replace(/\t/g, " ");
  console.log(string_script);
  // console.log(connection);
  try {
    const [rows, fields] = await connection.query(string_script);
    result = rows;
    res.status(200).send(result);
  } catch (error) {
    console.log("error" + error);
    res.status(401).send(error);
  }
}

async function convertGPL(req, res){
  const endpoint = process.env.ENDPOINT

  let graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer MY_TOKEN',
    }
  });


  let body = req.body.gpl.replace(/\"/g, '"');
  let request = gql`${body}`;

   // console.log(request)
   const results = await graphQLClient.request(request);
   // console.log(JSON.stringify(results))
  if(results.ClientError){
    res.status(400).send(results.ClientError)
  }else{
    res.status(200).send(results);
  }
  };

  // const data = await request(endpoint, query)
  // console.log(JSON.stringify(data))

async function test(req, res) {
    console.log("SADSADASDASD");
}

async function uploadFile(req,res) {
  await multerUpload.upload(req,res, (err)=>{
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.status(403).JSON({status: "KO", message: "A Multer error occurred when uploading."})
    }else if (err) {
      console.log(err);
      res.status(403).send({status: "KO", message: "A Multer error occurred when uploading."})
    }else{
      console.log("Upload is okay");
      res.status(200).send({status: "OK", message: "OK"})
    }
  })
}

async function createPaypalSDK(req, res){
  let card_data = {
    "intent": "sale",
    "payer": {
      "payment_method": "credit_card",
      "funding_instruments": [{
        "credit_card": {
          "type": "visa",
          "number": "4032033177759185",
          "expire_month": "08",
          "expire_year": "2027",
          "cvv2": "762",
          "first_name": "Joe",
          "last_name": "Shopper",
          "billing_address": {
            "line1": "52 N Main ST",
            "city": "Johnstown",
            "state": "OH",
            "postal_code": "43210",
            "country_code": "US"
          }}}]},
    "transactions": [{
      "amount": {
        "total": "0.00001",
        "currency": "USD",
        "details": {
          "subtotal": "0.00000001",
          "tax": "0",
          "shipping": "0"}},
      "description": "This is the payment transaction description."
    }]};
  console.log(paypal)
  paypal.payment.create(card_data, function(error, payment){
    if(error){
      console.error(error);
      res.status(400).json({status: "KO", ...error})
    } else {
      console.log(payment);
      res.status(200).json({status: "OK", ...payment})
    }
  });
}

async function testPredict(req, res){
  let {currentLocation} = req.body
  if(!currentLocation || currentLocation === "") currentLocation = '{"lat":21.009564,"lng":105.80800}'

  await tensor.predict.predictByGeolocation(currentLocation)
}

async function predictProduct(req, res){
  let {currentLocation} = req.body
  if(!currentLocation || currentLocation === "") currentLocation = '{"lat":21.009564,"lng":105.80800}'

  // await tensor.predict.predictByGeolocation(currentLocation)

  res.status(200).json({
    result: [
      {
        ID: 'P-e3bRX145Ge1R8lH6R6WtQg3d83LT31G1U3mJBd8Ck8V',
        PRODUCT_NAME: 'Iphone 13',
        SELLER_ID: 'S-mwghCLYPnn6aSlciwf32i7kxM11tFd7WNBbvvHzidd6',
        DETAILS: '<p>iPhone 13. Hệ thống camera k&eacute;p ti&ecirc;n tiến nhất từng c&oacute; tr&ecirc;n iPhone. Chip A15 Bionic thần tốc. Bước nhảy vọt về thời lượng pin. Thiết kế bền bỉ. Mạng 5G si&ecirc;u nhanh.1 C&ugrave;ng với m&agrave;n h&igrave;nh Super Retina XDR s&aacute;ng hơn.</p>\n' +
            '<p>T&iacute;nh năng nổi bật<br />M&agrave;n h&igrave;nh Super Retina XDR 6.1 inch2<br />Chế độ Điện Ảnh l&agrave;m tăng th&ecirc;m độ s&acirc;u trường ảnh n&ocirc;ng v&agrave; tự động thay đổi ti&ecirc;u cự trong video<br />Hệ thống camera k&eacute;p ti&ecirc;n tiến với camera Wide v&agrave; Ultra Wide 12MP; Phong C&aacute;ch Nhiếp Ảnh, HDR th&ocirc;ng minh thế hệ 4, chế độ Ban Đ&ecirc;m, khả năng quay video HDR Dolby Vision 4K<br />Camera trước TrueDepth 12MP với chế độ Ban Đ&ecirc;m v&agrave; khả năng quay video HDR Dolby Vision 4K<br />Chip A15 Bionic cho hiệu năng thần tốc<br />Thời gian xem video l&ecirc;n đến 19 giờ3<br />Thiết kế bền bỉ với Ceramic Shield<br />Khả năng chống nước đạt chuẩn IP68 đứng đầu thị trường4<br />Mạng 5G cho tốc độ tải xuống si&ecirc;u nhanh, xem video v&agrave; nghe nhạc trực tuyến chất lượng cao1<br />iOS 15 t&iacute;ch hợp nhiều t&iacute;nh năng mới cho ph&eacute;p bạn l&agrave;m được nhiều việc hơn bao giờ hết với iPhone5<br />Hỗ trợ phụ kiện MagSafe gi&uacute;p dễ d&agrave;ng gắn kết v&agrave; sạc kh&ocirc;ng d&acirc;y nhanh hơn6<br />Ph&aacute;p l&yacute;<br />1Cần c&oacute; g&oacute;i cước dữ liệu. Mạng 5G chỉ khả dụng ở một số thị trường v&agrave; được cung cấp qua một số nh&agrave; mạng. Tốc độ c&oacute; thể thay đổi t&ugrave;y địa điểm v&agrave; nh&agrave; mạng. Để biết th&ocirc;ng tin về hỗ trợ mạng 5G, vui l&ograve;ng li&ecirc;n hệ nh&agrave; mạng v&agrave; truy cập apple.com/iphone/cellular</p>\n' +
            '<p>2M&agrave;n h&igrave;nh c&oacute; c&aacute;c g&oacute;c bo tr&ograve;n theo đường cong tuyệt đẹp v&agrave; nằm gọn theo một h&igrave;nh chữ nhật chuẩn. Khi t&iacute;nh theo h&igrave;nh chữ nhật chuẩn, k&iacute;ch thước m&agrave;n h&igrave;nh l&agrave; 6.06 inch theo đường ch&eacute;o. Diện t&iacute;ch hiển thị thực tế nhỏ hơn.</p>\n' +
            '<p>3Thời lượng pin kh&aacute;c nhau t&ugrave;y theo c&aacute;ch sử dụng v&agrave; cấu h&igrave;nh. Truy cập apple.com/batteries để biết th&ecirc;m th&ocirc;ng tin.</p>\n' +
            '<p>4iPhone 13 c&oacute; khả năng chống nước, chống tia nước v&agrave; chống bụi. Sản phẩm đ&atilde; qua kiểm nghiệm trong điều kiện ph&ograve;ng th&iacute; nghiệm c&oacute; kiểm so&aacute;t đạt mức IP68 theo ti&ecirc;u chuẩn IEC 60529. Khả năng chống tia nước, chống nước v&agrave; chống bụi kh&ocirc;ng phải l&agrave; c&aacute;c điều kiện vĩnh viễn. Khả năng n&agrave;y c&oacute; thể giảm do hao m&ograve;n th&ocirc;ng thường. Kh&ocirc;ng sạc pin khi iPhone đang bị ướt. Vui l&ograve;ng tham khảo hướng dẫn sử dụng để biết c&aacute;ch lau sạch v&agrave; l&agrave;m kh&ocirc; m&aacute;y. Kh&ocirc;ng bảo h&agrave;nh sản phẩm bị hỏng do thấm chất lỏng.</p>\n' +
            '<p>5Một số t&iacute;nh năng kh&ocirc;ng khả dụng tại một số quốc gia hoặc khu vực.</p>\n' +
            '<p>6Phụ kiện được b&aacute;n ri&ecirc;ng.</p>\n' +
            '<p>Th&ocirc;ng số kỹ thuật<br />Truy cập apple.com/iphone/compare để xem cấu h&igrave;nh đầy đủ.</p>\n' +
            '<p>Gi&aacute; sản phẩm tr&ecirc;n Tiki đ&atilde; bao gồm thuế theo luật hiện h&agrave;nh. B&ecirc;n cạnh đ&oacute;, tuỳ v&agrave;o loại sản phẩm, h&igrave;nh thức v&agrave; địa chỉ giao h&agrave;ng m&agrave; c&oacute; thể ph&aacute;t sinh th&ecirc;m chi ph&iacute; kh&aacute;c như ph&iacute; vận chuyển, phụ ph&iacute; h&agrave;ng cồng kềnh, thuế nhập khẩu (đối với đơn h&agrave;ng giao từ nước ngo&agrave;i c&oacute; gi&aacute; trị tr&ecirc;n 1 triệu đồng).....</p>',
        DESCRIPTION: null,
        PRICE: 30000000,
        PRODUCT_DESCRIPTION: null,
        CREATE_AT: 1658057315912,
        UPDATE_AT: 1658335657337,
        PRODUCT_LOCK: 0,
        STATE: 1,
        CATEGORY_ID: 'C-3R53UclBf3wBT1EHHgUaYg3rW28o3GXF3oIW55BLoUE',
        GALLERY: '["/media/0ba88c34c1d968042af407fb9e4e9029_jpg1658071000003.webp","/media/58aba2228f802ff70736368ccae00ade_jpg1658071000004.webp","/media/66059a54a3a139d45841d412379b1fe4_jpg1658071000034.webp","/media/b72c2c966e728c24cc50cefa330d5d2d_jpg1658071000034.webp"]',
        PRODUCT_OPTIONS: '["Đen","Đỏ","Vàng"]',
        NUMBER_PRODUCT: 1000,
        DELIVERY_PRICE: 25000,
        SELLER_NAME: 'Nguyen',
        PHONE_NUMBER: '0902223120',
        MAIN_CATEGORIES: 'a',
        LOCATION: '{"lat":21.009564,"lng":105.80735}',
        RATING: null,
        FOLLOWER: null,
        CATEGORIES_NAME: 'Điện thoại - Máy tính bảng',
        SLUG: 'dien-thoai-may-tinh-bang'
      },
      {
        ID: 'P-EGo4U8BtwlCCzAm6orMKEe0s8a6b12Sv2fL8E6YHWsT',
        PRODUCT_NAME: 'Samsung Galaxy A53',
        SELLER_ID: 'S-mwghCLYPnn6aSlciwf32i7kxM11tFd7WNBbvvHzidd6',
        DETAILS: '',
        DESCRIPTION: null,
        PRICE: 10000000,
        PRODUCT_DESCRIPTION: null,
        CREATE_AT: 1658334073193,
        UPDATE_AT: 1658335680060,
        PRODUCT_LOCK: 0,
        STATE: 1,
        CATEGORY_ID: 'C-3R53UclBf3wBT1EHHgUaYg3rW28o3GXF3oIW55BLoUE',
        GALLERY: '["/media/9d790c8f0d3742eb3dd96c38444ee5b4_png1658334072936.webp","/media/49f7a379ec30fa7847fb4008271764ba_png1658334072936.webp","/media/4874f7e43a108fa9a7c0817943362fb6_jpg1658334072936.webp","/media/cd7daed7cc26ca450ce29b4554999598_png1658334072936.webp","/media/f3a64265fba6e3e49e432d2a68af575d_png1658334072937.webp"]',
        PRODUCT_OPTIONS: '["Trắng","Hồng"]',
        NUMBER_PRODUCT: 500,
        DELIVERY_PRICE: 25000,
        SELLER_NAME: 'Nguyen',
        PHONE_NUMBER: '0902223120',
        MAIN_CATEGORIES: 'a',
        LOCATION: '{"lat":21.009564,"lng":105.80735}',
        RATING: null,
        FOLLOWER: null,
        CATEGORIES_NAME: 'Điện thoại - Máy tính bảng',
        SLUG: 'dien-thoai-may-tinh-bang'
      },{
        ID: 'P-EGo4U8BtwlCCzAm6orMKEe0s8a6b12Sv2fL8E6YHWsT',
        PRODUCT_NAME: 'Samsung Galaxy A53',
        SELLER_ID: 'S-mwghCLYPnn6aSlciwf32i7kxM11tFd7WNBbvvHzidd6',
        DETAILS: '',
        DESCRIPTION: null,
        PRICE: 10000000,
        PRODUCT_DESCRIPTION: null,
        CREATE_AT: 1658334073193,
        UPDATE_AT: 1658335680060,
        PRODUCT_LOCK: 0,
        STATE: 1,
        CATEGORY_ID: 'C-3R53UclBf3wBT1EHHgUaYg3rW28o3GXF3oIW55BLoUE',
        GALLERY: '["/media/9d790c8f0d3742eb3dd96c38444ee5b4_png1658334072936.webp","/media/49f7a379ec30fa7847fb4008271764ba_png1658334072936.webp","/media/4874f7e43a108fa9a7c0817943362fb6_jpg1658334072936.webp","/media/cd7daed7cc26ca450ce29b4554999598_png1658334072936.webp","/media/f3a64265fba6e3e49e432d2a68af575d_png1658334072937.webp"]',
        PRODUCT_OPTIONS: '["Trắng","Hồng"]',
        NUMBER_PRODUCT: 500,
        DELIVERY_PRICE: 25000,
        SELLER_NAME: 'Nguyen',
        PHONE_NUMBER: '0902223120',
        MAIN_CATEGORIES: 'a',
        LOCATION: '{"lat":21.009564,"lng":105.80735}',
        RATING: null,
        FOLLOWER: null,
        CATEGORIES_NAME: 'Điện thoại - Máy tính bảng',
        SLUG: 'dien-thoai-may-tinh-bang'
      },{
        ID: 'P-EGo4U8BtwlCCzAm6orMKEe0s8a6b12Sv2fL8E6YHWsT',
        PRODUCT_NAME: 'Samsung Galaxy A53',
        SELLER_ID: 'S-mwghCLYPnn6aSlciwf32i7kxM11tFd7WNBbvvHzidd6',
        DETAILS: '',
        DESCRIPTION: null,
        PRICE: 10000000,
        PRODUCT_DESCRIPTION: null,
        CREATE_AT: 1658334073193,
        UPDATE_AT: 1658335680060,
        PRODUCT_LOCK: 0,
        STATE: 1,
        CATEGORY_ID: 'C-3R53UclBf3wBT1EHHgUaYg3rW28o3GXF3oIW55BLoUE',
        GALLERY: '["/media/9d790c8f0d3742eb3dd96c38444ee5b4_png1658334072936.webp","/media/49f7a379ec30fa7847fb4008271764ba_png1658334072936.webp","/media/4874f7e43a108fa9a7c0817943362fb6_jpg1658334072936.webp","/media/cd7daed7cc26ca450ce29b4554999598_png1658334072936.webp","/media/f3a64265fba6e3e49e432d2a68af575d_png1658334072937.webp"]',
        PRODUCT_OPTIONS: '["Trắng","Hồng"]',
        NUMBER_PRODUCT: 500,
        DELIVERY_PRICE: 25000,
        SELLER_NAME: 'Nguyen',
        PHONE_NUMBER: '0902223120',
        MAIN_CATEGORIES: 'a',
        LOCATION: '{"lat":21.009564,"lng":105.80735}',
        RATING: null,
        FOLLOWER: null,
        CATEGORIES_NAME: 'Điện thoại - Máy tính bảng',
        SLUG: 'dien-thoai-may-tinh-bang'
      },{
        ID: 'P-EGo4U8BtwlCCzAm6orMKEe0s8a6b12Sv2fL8E6YHWsT',
        PRODUCT_NAME: 'Samsung Galaxy A53',
        SELLER_ID: 'S-mwghCLYPnn6aSlciwf32i7kxM11tFd7WNBbvvHzidd6',
        DETAILS: '',
        DESCRIPTION: null,
        PRICE: 10000000,
        PRODUCT_DESCRIPTION: null,
        CREATE_AT: 1658334073193,
        UPDATE_AT: 1658335680060,
        PRODUCT_LOCK: 0,
        STATE: 1,
        CATEGORY_ID: 'C-3R53UclBf3wBT1EHHgUaYg3rW28o3GXF3oIW55BLoUE',
        GALLERY: '["/media/9d790c8f0d3742eb3dd96c38444ee5b4_png1658334072936.webp","/media/49f7a379ec30fa7847fb4008271764ba_png1658334072936.webp","/media/4874f7e43a108fa9a7c0817943362fb6_jpg1658334072936.webp","/media/cd7daed7cc26ca450ce29b4554999598_png1658334072936.webp","/media/f3a64265fba6e3e49e432d2a68af575d_png1658334072937.webp"]',
        PRODUCT_OPTIONS: '["Trắng","Hồng"]',
        NUMBER_PRODUCT: 500,
        DELIVERY_PRICE: 25000,
        SELLER_NAME: 'Nguyen',
        PHONE_NUMBER: '0902223120',
        MAIN_CATEGORIES: 'a',
        LOCATION: '{"lat":21.009564,"lng":105.80735}',
        RATING: null,
        FOLLOWER: null,
        CATEGORIES_NAME: 'Điện thoại - Máy tính bảng',
        SLUG: 'dien-thoai-may-tinh-bang'
      },{
        ID: 'P-EGo4U8BtwlCCzAm6orMKEe0s8a6b12Sv2fL8E6YHWsT',
        PRODUCT_NAME: 'Samsung Galaxy A53',
        SELLER_ID: 'S-mwghCLYPnn6aSlciwf32i7kxM11tFd7WNBbvvHzidd6',
        DETAILS: '',
        DESCRIPTION: null,
        PRICE: 10000000,
        PRODUCT_DESCRIPTION: null,
        CREATE_AT: 1658334073193,
        UPDATE_AT: 1658335680060,
        PRODUCT_LOCK: 0,
        STATE: 1,
        CATEGORY_ID: 'C-3R53UclBf3wBT1EHHgUaYg3rW28o3GXF3oIW55BLoUE',
        GALLERY: '["/media/9d790c8f0d3742eb3dd96c38444ee5b4_png1658334072936.webp","/media/49f7a379ec30fa7847fb4008271764ba_png1658334072936.webp","/media/4874f7e43a108fa9a7c0817943362fb6_jpg1658334072936.webp","/media/cd7daed7cc26ca450ce29b4554999598_png1658334072936.webp","/media/f3a64265fba6e3e49e432d2a68af575d_png1658334072937.webp"]',
        PRODUCT_OPTIONS: '["Trắng","Hồng"]',
        NUMBER_PRODUCT: 500,
        DELIVERY_PRICE: 25000,
        SELLER_NAME: 'Nguyen',
        PHONE_NUMBER: '0902223120',
        MAIN_CATEGORIES: 'a',
        LOCATION: '{"lat":21.009564,"lng":105.80735}',
        RATING: null,
        FOLLOWER: null,
        CATEGORIES_NAME: 'Điện thoại - Máy tính bảng',
        SLUG: 'dien-thoai-may-tinh-bang'
      },{
        ID: 'P-EGo4U8BtwlCCzAm6orMKEe0s8a6b12Sv2fL8E6YHWsT',
        PRODUCT_NAME: 'Samsung Galaxy A53',
        SELLER_ID: 'S-mwghCLYPnn6aSlciwf32i7kxM11tFd7WNBbvvHzidd6',
        DETAILS: '',
        DESCRIPTION: null,
        PRICE: 10000000,
        PRODUCT_DESCRIPTION: null,
        CREATE_AT: 1658334073193,
        UPDATE_AT: 1658335680060,
        PRODUCT_LOCK: 0,
        STATE: 1,
        CATEGORY_ID: 'C-3R53UclBf3wBT1EHHgUaYg3rW28o3GXF3oIW55BLoUE',
        GALLERY: '["/media/9d790c8f0d3742eb3dd96c38444ee5b4_png1658334072936.webp","/media/49f7a379ec30fa7847fb4008271764ba_png1658334072936.webp","/media/4874f7e43a108fa9a7c0817943362fb6_jpg1658334072936.webp","/media/cd7daed7cc26ca450ce29b4554999598_png1658334072936.webp","/media/f3a64265fba6e3e49e432d2a68af575d_png1658334072937.webp"]',
        PRODUCT_OPTIONS: '["Trắng","Hồng"]',
        NUMBER_PRODUCT: 500,
        DELIVERY_PRICE: 25000,
        SELLER_NAME: 'Nguyen',
        PHONE_NUMBER: '0902223120',
        MAIN_CATEGORIES: 'a',
        LOCATION: '{"lat":21.009564,"lng":105.80735}',
        RATING: null,
        FOLLOWER: null,
        CATEGORIES_NAME: 'Điện thoại - Máy tính bảng',
        SLUG: 'dien-thoai-may-tinh-bang'
      },{
        ID: 'P-EGo4U8BtwlCCzAm6orMKEe0s8a6b12Sv2fL8E6YHWsT',
        PRODUCT_NAME: 'Samsung Galaxy A53',
        SELLER_ID: 'S-mwghCLYPnn6aSlciwf32i7kxM11tFd7WNBbvvHzidd6',
        DETAILS: '',
        DESCRIPTION: null,
        PRICE: 10000000,
        PRODUCT_DESCRIPTION: null,
        CREATE_AT: 1658334073193,
        UPDATE_AT: 1658335680060,
        PRODUCT_LOCK: 0,
        STATE: 1,
        CATEGORY_ID: 'C-3R53UclBf3wBT1EHHgUaYg3rW28o3GXF3oIW55BLoUE',
        GALLERY: '["/media/9d790c8f0d3742eb3dd96c38444ee5b4_png1658334072936.webp","/media/49f7a379ec30fa7847fb4008271764ba_png1658334072936.webp","/media/4874f7e43a108fa9a7c0817943362fb6_jpg1658334072936.webp","/media/cd7daed7cc26ca450ce29b4554999598_png1658334072936.webp","/media/f3a64265fba6e3e49e432d2a68af575d_png1658334072937.webp"]',
        PRODUCT_OPTIONS: '["Trắng","Hồng"]',
        NUMBER_PRODUCT: 500,
        DELIVERY_PRICE: 25000,
        SELLER_NAME: 'Nguyen',
        PHONE_NUMBER: '0902223120',
        MAIN_CATEGORIES: 'a',
        LOCATION: '{"lat":21.009564,"lng":105.80735}',
        RATING: null,
        FOLLOWER: null,
        CATEGORIES_NAME: 'Điện thoại - Máy tính bảng',
        SLUG: 'dien-thoai-may-tinh-bang'
      },{
        ID: 'P-EGo4U8BtwlCCzAm6orMKEe0s8a6b12Sv2fL8E6YHWsT',
        PRODUCT_NAME: 'Samsung Galaxy A53',
        SELLER_ID: 'S-mwghCLYPnn6aSlciwf32i7kxM11tFd7WNBbvvHzidd6',
        DETAILS: '',
        DESCRIPTION: null,
        PRICE: 10000000,
        PRODUCT_DESCRIPTION: null,
        CREATE_AT: 1658334073193,
        UPDATE_AT: 1658335680060,
        PRODUCT_LOCK: 0,
        STATE: 1,
        CATEGORY_ID: 'C-3R53UclBf3wBT1EHHgUaYg3rW28o3GXF3oIW55BLoUE',
        GALLERY: '["/media/9d790c8f0d3742eb3dd96c38444ee5b4_png1658334072936.webp","/media/49f7a379ec30fa7847fb4008271764ba_png1658334072936.webp","/media/4874f7e43a108fa9a7c0817943362fb6_jpg1658334072936.webp","/media/cd7daed7cc26ca450ce29b4554999598_png1658334072936.webp","/media/f3a64265fba6e3e49e432d2a68af575d_png1658334072937.webp"]',
        PRODUCT_OPTIONS: '["Trắng","Hồng"]',
        NUMBER_PRODUCT: 500,
        DELIVERY_PRICE: 25000,
        SELLER_NAME: 'Nguyen',
        PHONE_NUMBER: '0902223120',
        MAIN_CATEGORIES: 'a',
        LOCATION: '{"lat":21.009564,"lng":105.80735}',
        RATING: null,
        FOLLOWER: null,
        CATEGORIES_NAME: 'Điện thoại - Máy tính bảng',
        SLUG: 'dien-thoai-may-tinh-bang'
      },{
        ID: 'P-EGo4U8BtwlCCzAm6orMKEe0s8a6b12Sv2fL8E6YHWsT',
        PRODUCT_NAME: 'Samsung Galaxy A53',
        SELLER_ID: 'S-mwghCLYPnn6aSlciwf32i7kxM11tFd7WNBbvvHzidd6',
        DETAILS: '',
        DESCRIPTION: null,
        PRICE: 10000000,
        PRODUCT_DESCRIPTION: null,
        CREATE_AT: 1658334073193,
        UPDATE_AT: 1658335680060,
        PRODUCT_LOCK: 0,
        STATE: 1,
        CATEGORY_ID: 'C-3R53UclBf3wBT1EHHgUaYg3rW28o3GXF3oIW55BLoUE',
        GALLERY: '["/media/9d790c8f0d3742eb3dd96c38444ee5b4_png1658334072936.webp","/media/49f7a379ec30fa7847fb4008271764ba_png1658334072936.webp","/media/4874f7e43a108fa9a7c0817943362fb6_jpg1658334072936.webp","/media/cd7daed7cc26ca450ce29b4554999598_png1658334072936.webp","/media/f3a64265fba6e3e49e432d2a68af575d_png1658334072937.webp"]',
        PRODUCT_OPTIONS: '["Trắng","Hồng"]',
        NUMBER_PRODUCT: 500,
        DELIVERY_PRICE: 25000,
        SELLER_NAME: 'Nguyen',
        PHONE_NUMBER: '0902223120',
        MAIN_CATEGORIES: 'a',
        LOCATION: '{"lat":21.009564,"lng":105.80735}',
        RATING: null,
        FOLLOWER: null,
        CATEGORIES_NAME: 'Điện thoại - Máy tính bảng',
        SLUG: 'dien-thoai-may-tinh-bang'
      }
    ]
  })
}