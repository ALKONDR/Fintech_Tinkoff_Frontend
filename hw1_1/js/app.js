const phrases = {
	"greeting": "Hello! I am anagram checker :) Please type your first word",
	"second": "Great! Type your second word",
	"isAnagram": "Your words are anagrams",
	"notAnagram": "Your words aren't anagrams"
}

const SortString = (str) => str.split('').sort().join();

function action() {
	let firstWord = prompt(phrases["greeting"]);
	let secondWord = prompt(phrases["second"]);

	let sortedFirstWord = SortString(firstWord);
	let sortedSecondWord = SortString(secondWord);

	let result = sortedFirstWord === sortedSecondWord ? phrases["isAnagram"] : phrases["notAnagram"];

	alert(result);

	element = addToLocalStorage(firstWord, secondWord, result);
	createRow(element);
}

function addToLocalStorage(firstWord, secondWord, result) {
	resultsTable = JSON.parse(localStorage["ResultsTable"]);

	let element = {
		"index": resultsTable.length,
		"firstWord": firstWord,
		"secondWord": secondWord,
		"result": result
	};

	resultsTable.push(element);
	localStorage["ResultsTable"] = JSON.stringify(resultsTable);

	return element;
}

function createRow(element) {
	let tbody = document.getElementById("ResultsTable");

	let tr = document.createElement("tr");
	tr.id = 'row${element["index"]}';

	let firstWord = document.createElement("th");
	firstWord.appendChild(document.createTextNode(element["firstWord"]));

	let secondWord = document.createElement("th");
	secondWord.appendChild(document.createTextNode(element["secondWord"]));

	let result = document.createElement("th");
	result.appendChild(document.createTextNode(element["result"]));

	let deleteTh = document.createElement("th");

	let deleteButton = document.createElement("button");
	deleteButton.appendChild(document.createTextNode("Delete"));
	deleteButton.className = "btn btn-danger";

	deleteButton.onclick = () => {

		let resultsTable = JSON.parse(localStorage["ResultsTable"]);
		delete resultsTable[element["index"]];
		localStorage["ResultsTable"] = JSON.stringify(resultsTable);

		let deleteElement = document.getElementById('row${element["index"]}');
		let parentNode = document.getElementById("ResultsTable");

		parentNode.removeChild(deleteElement);
	};

	deleteTh.appendChild(deleteButton);

	tr.appendChild(firstWord);
	tr.appendChild(secondWord);
	tr.appendChild(result);
	tr.appendChild(deleteTh);

	tbody.appendChild(tr);
}

function loadTable() {
	resultsTable = JSON.parse(localStorage["ResultsTable"]);

	for(let index in resultsTable){
		if (resultsTable[index] == null)
			continue;

		createRow(resultsTable[index]);
	}
}

(function(){
	if (localStorage["ResultsTable"] === undefined)
		localStorage["ResultsTable"] = JSON.stringify([]);
	else
		loadTable();
})();