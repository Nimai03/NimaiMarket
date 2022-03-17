//ВЫВОД ТОВАРОВ И ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ
//Вывести сначала все продукты
//Добавить фильтрацию по категориям и поиску


//Эта переменная содержит весь список продуктов
var products;

//Фетч запрос к json файлу: если запрос неудачный, выводим сообщение в консоль.
//Если запрос удачный: присваиваем переменной products массив из объектов json, взятый из products.json и вызываем функцию main()
fetch("products.json").then(function(response){
	if(response.ok){
		response.json().then(function(json){
			products = json;
			main();
		});
	}else{
		console.log("ERROR loading products.json " + response.status + ': ' + response.statusText);
	}
})



//Основная функция, в ней прописаны все переменные и все остальные функции для фильтрации
function main(){
	//Здесь определяются все html элементы, с которыми будем работать:
	//Выпадающий список с категориями, поисковая строка, кнопка, основное поле для контента
	var type = document.querySelector("#type");
	var type2 = document.querySelector("#filling");
	var search = document.querySelector("#search");
	var searchBtn = document.querySelector("#button");
	var main = document.querySelector("main");


 	//Для удобства поместили список продуктов в переменную final: она как финальный набор продуктов для отображения
 	//Помещаем продукты в final и вызываем функцию updateDisplay() чтобы изначально вывести все продукты

 	var lastType = type.value;
 	var lastSearch = "";

 	var categoryProducts
	var finalProducts = products;
	updateDisplay();


	categoryProducts = [];
	finalProducts =[];
	
	//Функция для обновления содержимого на странице
	function updateDisplay(){


		while (main.firstChild) {
      		main.removeChild(main.firstChild);
    	}	
		//Если список финальных продуктов пуст ( не нашлось подходящих товаров ), то выводим сообщение что ничего не нашлось
		//Иначе проходимся по всему финальному списку продуктов циклом и вызываем функцию blob()- где параметр- это каждый продукт из цикла 
		if(finalProducts.length === 0){
			var para = document.createElement("p");
			para.textContent = "No results";
			main.appendChild(para);
		}else{
			for(var i = 0; i < finalProducts.length; i++){
				blob(finalProducts[i]);
			}
		}
	}

	//Функция нужна для фетч запроса к картинкам товаров.
	function blob(product) {
		//В url присваиваем адрес картинок
		var url = "images/" + product.image;
		//Фетч запрос
		fetch(url).then(function(response){
			//В случае удачного запроса создаем URL объект ( создаем адрес картинки чтобы потом этот адрес присвоить атрибуту src для изображения)
			//И вызываем функцию show(objectURL, product) с параметрами: objectURL и product
			if(response.ok){
				response.blob().then(function(blob){
					var objectURL = URL.createObjectURL(blob);
					show(objectURL, product);
					
				})
			}else{
				console.log("ERROR loading images " + response.status + ': ' + response.statusText);
			}
		})
	}

	//Функция которая создает html элементы, дает им нужные значения, формируя товар
	function show(objectURL, product){
		var section = document.createElement("div");
		section.setAttribute("class", "product " + product.type);
		var p = document.createElement("p");
		var img = document.createElement("img");
		p.textContent = product.name;
		img.src = objectURL;

		main.appendChild(section);
		section.appendChild(p);
		section.appendChild(img)


	}
	/*=========ДОБАВЛЯЕМ ФИЛЬТРАЦИЮ ПО КАТЕГОРИЯМ И ПОИСКУ=============*/


	

	searchBtn.onclick = filterCategory;
	
	function filterCategory(e){
    	e.preventDefault();
    	
    	categoryProducts = [];
		finalProducts = [];

		if(type.value === lastType && search.value.trim() === lastSearch) {
      		return;
    	} else{
    		lastType = type.value;
    		lastSearch = search.value.trim();

    		if(type.value === "All"){
				categoryProducts = products;
				searching();
			}else{
				var typeLowerCase = type.value.toLowerCase();
				var type2LowerCase = type2.value.toLowerCase();
				for(let i = 0; i < products.length; i++){

					if(products[i].type === typeLowerCase){
						categoryProducts.push(products[i]);
					}
				}

						

					
						
					

			searching();

		}			

    	}
		


		
	}

	function searching(){

		if(search.value.trim() === ""){
			finalProducts = categoryProducts;
			updateDisplay();
		}else{

			searchLowerCase = search.value.trim().toLowerCase();

			for(let i = 0; i < categoryProducts.length; i++){
				if(categoryProducts[i].name.indexOf(searchLowerCase) !== -1){
					finalProducts.push(categoryProducts[i])

				}
			}
			updateDisplay();

		}

	}


}


