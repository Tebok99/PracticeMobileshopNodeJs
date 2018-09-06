// 생성자 함수 선언
var counter = 0;
function Product(name, image, price, count) {
  this.index = counter++;
  this.name = name;
  this.image = image;
  this.price = price;
  this.count = count;
}

// 변수 선언
var products = [
  new Product("javaScript", "wintersolstice_pivato_1080.jpg", 20000, 30),
  new Product("jQuery", "wintersolstice_pivato_1080.jpg", 28000, 30),
  new Product("Node.js", "wintersolstice_pivato_1080.jpg", 32000, 30),
  new Product("Socket.io", "wintersolstice_pivato_1080.jpg", 17000, 30),
  new Product("Connect", "wintersolstice_pivato_1080.jpg", 18000, 30),
  new Product("Express", "wintersolstice_pivato_1080.jpg", 31000, 30),
  new Product("EJS", "wintersolstice_pivato_1080.jpg", 12000, 30),
];

module.exports = products;