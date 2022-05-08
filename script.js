//Это все наши элементы
var elements;

//Здесь производится запрос к файлу с элементами.
fetch("products.json").then(function(response){
	//Если ответ вернулся успешно, значит присваиваем все элементы переменной elements и запускаем основную функцию
	if(response.ok){
		response.json().then(function(json){
			elements = json;
			main()
		})
	}else{
		//Если нет, сообщение:
		console.log("ERROR loading products.json " + response.status + ': ' + response.statusText);
	}
})


//Эта основная функция содержит в себе все переменные и другие функции
function main(){
	//Определяем все элементы с которыми будем работать
	var category = document.querySelector("#category");
	var type = document.querySelector("#type");
	var search = document.querySelector("#searching");
	var filterBtn = document.querySelector("#filter-btn")
	var elementsBody = document.querySelector(".main-body")

	//Учет последних выбранных категорийи запроса
	var lastCategory = category.value;
	var lastType = type.value;
	var lastSearch = "";

	//Результаты фильтрации по категориям и запросу
	//finalGroup содержит финальный набор элементов в результате фильтрации
	var categoryGroup;
	var typeGroup;
	var finalGroup;

	//Первоначально в finalGroup есть все элементы
	//Нужно изначально вывести сразу все элементы
	finalGroup = elements;
	updateDisplay();

	//Установить значение переменных пустому массиву во время выполнения поиска 
	categoryGroup = [];
	typeGroup = [];
	finalGroup = [];

	//Обновление дисплея с новым набором элементов
	function updateDisplay() {
		//Удаление предыдущего содержимого
		while(elementsBody.firstChild){
			elementsBody.removeChild(elementsBody.firstChild);
		}

		//Если finalGroup пустой, вывести текст:
		if(finalGroup.length == 0){
			var para = document.createElement("p");
			para.textContent = "No results";
			elementsBody.appendChild(para);
		}else{
			for(let i = 0; i < finalGroup.length; i++){
				blob(finalGroup[i]);
			}
		}
	}

	//Выкуриваем картинку элемента
	function blob(element){
		//Создаем url адрес картинки
		var url = "products/" + element.image;

		fetch(url).then(function(response){
			if(response.ok){
				response.blob().then(function(blob){
					var objectURL = URL.createObjectURL(blob);
					showElement(objectURL, element);
				})
			}else{
				console.log("ERROR loading url " + response.status + ': ' + response.statusText);
			}
		})
	}

	//Создание элементов и их вывод на дисплей
	function showElement(objectURL, element){
		//Создание элементов
		var elementBlock = document.createElement("div");
		elementBlock.setAttribute("class", "element");

		var elementName = document.createElement("h2");
		elementName.setAttribute("class", "element-name");

		var elementImage = document.createElement("img");
		elementImage.setAttribute("class", "element-image");

		elementName.textContent = element.name.replace(element.name.charAt(0), element.name.charAt(0).toUpperCase());
		elementImage.src = objectURL;
		elementImage.alt = element.name;

		//Добавление в DOM
		elementsBody.appendChild(elementBlock);
		elementBlock.appendChild(elementName);
		elementBlock.appendChild(elementImage);
	}


	//ФИЛЬТРАЦИЯ ЭЛЕМЕНТОВ

	filterBtn.onclick = selectCategory

	function selectCategory(e){
		//Останавливаем отправку формы
		e.preventDefault();

		categoryGroup = [];
		
		finalGroup = [];
		if(category.value === lastCategory && type.value === lastType && search.value.trim() === lastSearch){
			return
		}else{
			lastCategory = category.value;
			lastSearch = search.value.trim();
			lastType = type.value;
			if(category.value === "Category"){
				categoryGroup = elements;
				selectType();
			}else{
				var categoryLowerCase = category.value.toLowerCase();

				for(let i = 0; i < elements.length; i++){
					if(elements[i].type === categoryLowerCase){
						categoryGroup.push(elements[i])
					}
				}
				selectType();
			}
		}
	}
	
	function selectType(){
		typeGroup = [];

		if(type.value === "Type"){
			typeGroup = categoryGroup;
			searchElements();
		}else{
			var typeLowerCase = type.value.toLowerCase();

			for(let i = 0; i < categoryGroup.length; i++){
				if(categoryGroup[i].type2 === typeLowerCase){
					typeGroup.push(categoryGroup[i]);
				}

			}
			searchElements();
		}
	}

	function searchElements() {
		
		if(search.value.trim() === ""){
			finalGroup = typeGroup;
			updateDisplay();
		}else{
			searchLowerCase = search.value.trim().toLowerCase();

			for(let i = 0; i < typeGroup.length; i++){
				if(categoryGroup[i].name.indexOf(searchLowerCase) != -1){
					finalGroup.push(typeGroup[i]);
				}
			}

			updateDisplay();

		}
	}



	



}


