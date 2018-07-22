'use strict'
// card dimensions
var cardDimension = {
	collapsed_height: "70px",
	expanded_height: "335px", 
	edit_mode_height: "400px"
};
// HTML entities
var glyphicon = {
	minimize:"&#x1f5d5;",
	maximize:"&#x26F6;",
	edit:"&#x270E;",
	save:"&#x2713;",
    delete:"&#x2715;",
	discard:"&#x2717;",
	pin:"&#x1f4cc;",
	star:"&#x2605;"
};

var rating_comment = ["Note Yet Rated","Poor","Below Average","Average","Good","Very Good"]; 
 // color of card for every rating
var rating_colors = ["lightgrey","#cd3333","#ff7d4d","#ffd365","#c2c264","#70b234"];
// namelist is obtained from localStorage on start or refresh
var mentee_name_list = localStorage.getItem("mentee_name_list");

/* cards should be created for saved mentees on start or refresh */
if (mentee_name_list === null || mentee_name_list === "") {
	// initialize it to an empty array
	mentee_name_list = []; 
} else { 
	// converting mentee_name_list string to array 
	mentee_name_list = mentee_name_list.split(","); 
	for (var i = 0 ; i < mentee_name_list.length ; i++) {
		/* creating cards for mentees in the namelist */
		createCard(mentee_name_list[i],localStorage.getItem(mentee_name_list[i])); 
	}
}

function addNewMentee() {
	var mentee_name = prompt("Enter Mentee Name");

	if (mentee_name === "") { // empty string is not 'false'
		alert("Invalid Input");
	} else if(mentee_name) { // valid input
		var name_unique = true;
		// checking if the entered name is unique
		for (var i = mentee_name_list.length-1; i >= 0; i--) {
			if (mentee_name == mentee_name_list[i]) {
				name_unique = false;
				break;
			}
		}
		if (name_unique) {
			// adding the name to the name_list
			mentee_name_list.push(mentee_name);
			// saving the mentee_name_list to localStorage
			localStorage.setItem("mentee_name_list",mentee_name_list.toString()); 
			// saving the mentee card info as a JSON under mentee_name
			localStorage.setItem(mentee_name,'{"rating_value":"0","review":""}'); 
			// creating a card for the mentee
			createCard(mentee_name,'{"rating_value":"0","review":""}'); 
		} else { // name's not unique
			alert("Mentee Already Exist");
		}
	} else {
		// user hit cancel
	}
}	

function createCard(mentee_name,card_info) {
	// look into JSON
	card_info = JSON.parse(card_info);
	// the card div also belongs to the class equivalent to the rating of the card i.e 0 to 5
	document.getElementById("cardContainer").innerHTML += "<div id='" + mentee_name + "' class='mentee-card " + card_info.rating_value + "'>\
																<button class='pin-card-btn' title='Pin Card' onclick='PINorUNPINcard(this)' onmouseover='prepareToPINcard(this)' onmouseout='reversePINPreparation(this)'></button>\
																<div class='card-titlebar'>" + mentee_name + " &#x2012\
																	<span class='rated-stars' title='Note Yet Rated'>\
																		<span class='rated-star star-1'>" + glyphicon.star + "</span>\
																		<span class='rated-star star-2'>" + glyphicon.star + "</span>\
																		<span class='rated-star star-3'>" + glyphicon.star + "</span>\
																		<span class='rated-star star-4'>" + glyphicon.star + "</span>\
																		<span class='rated-star star-5'>" + glyphicon.star + "</span>\
																	<span/>\
																</div>\
																<button class='maximize-minimize-card-btn card-btn' title='Maximize Card' onclick='MAXIMIZEorMINIMIZEcard(this)'>" + glyphicon.maximize + "</button>\
																<button class='edit-card-save-changes-btn card-btn' title='Edit Card' onclick='EDITorSAVE(this)'>" + glyphicon.edit + "</button>\
																<button class='delete-card-discard-changes-btn card-btn' title='Delete Card' onclick='DELETEorDISCARD(this)'>" + glyphicon.delete + "</button>\
																<div class='editable-content'>\
																	<textarea class='card-textarea' readOnly>" + card_info.review + "</textarea>\
																	<span class='rating-stars' onclick='registerRating(event)'>\
																		<span class='rating-star star-1' title='Poor' onmouseover='colorPreceedingStars(this)' onmouseout='uncolorPreceedingStars(this)'>" + glyphicon.star + "</span>\
																		<span class='rating-star star-2' title='Below Average' onmouseover='colorPreceedingStars(this)' onmouseout='uncolorPreceedingStars(this)'>" + glyphicon.star + "</span>\
																		<span class='rating-star star-3' title='Average' onmouseover='colorPreceedingStars(this)' onmouseout='uncolorPreceedingStars(this)'>" + glyphicon.star + "</span>\
																		<span class='rating-star star-4' title='Good'  onmouseover='colorPreceedingStars(this)' onmouseout='uncolorPreceedingStars(this)'>" + glyphicon.star + "</span>\
																		<span class='rating-star star-5' title='Very Good' onmouseover='colorPreceedingStars(this)' onmouseout='uncolorPreceedingStars(this)'>" + glyphicon.star + "</span>\
																	</span>\
																</div>\
														   </div>";
	var card = document.getElementById(mentee_name);
	// coloring the stars
	for (var i=card_info.rating_value,s=card.children[1].firstElementChild.firstElementChild; i > 0; i--, s=s.nextElementSibling) {
		s.style.color = "chocolate" ;
	}
	// updating the bg to respective color
	card.style.backgroundColor = rating_colors[card_info.rating_value];
	card.children[1].firstElementChild.title = rating_comment[card_info.rating_value];
}

function collapseAllCards(event) {
	// user either shouldn't click on any card (i.e clicks cardContainer) or click on any of the card
	var targetElement = event.target,card;
	if(targetElement.classList[0] != "card-container") {
		// obtaining the reference of the card that was clicked on
		while (targetElement.classList[0] != "mentee-card") {
			 targetElement = targetElement.parentNode;
		}
		card = targetElement;
	}
	// to collapse the expanded cards
	var cardContainer = document.getElementById("cardContainer");
	for (var i = 0; i < mentee_name_list.length; i++) {
		// collapsing the expanded cards that are not pinned
		if (cardContainer.children[i].style.maxHeight == cardDimension.expanded_height && cardContainer.children[i] != card && cardContainer.children[i].children[0].title != "Unpin Card") {
			// collapsing the card
			cardContainer.children[i].style.maxHeight = cardDimension.collapsed_height;
			// modifying their max_min_btn
			cardContainer.children[i].children[2].innerHTML = glyphicon.maximize;
			cardContainer.children[i].children[2].title = "Maximize Card";		
		}
	}
}

function PINorUNPINcard(pin_btn) {
	if (pin_btn.title == "Pin Card") {
		pin_btn.title = "Unpin Card";
		pin_btn.style.backgroundColor = "mediumpurple";
	} else {
		pin_btn.title = "Pin Card";
		pin_btn.style.backgroundColor = "gray";
	}
}	
function prepareToPINcard(pin_btn) {
	if (pin_btn.title == "Pin Card") {
		pin_btn.innerHTML = glyphicon.pin;
	}
}	
function reversePINPreparation(pin_btn) {
	if (pin_btn.title == "Pin Card") {
		pin_btn.innerHTML = "";
	}
}				


function MAXIMIZEorMINIMIZEcard(min_max_btn) {
	var card = min_max_btn.parentNode;

	if (min_max_btn.title == "Maximize Card") {
		// increasing the card max-height, this allows the textarea to be visible
		card.style.maxHeight = cardDimension.expanded_height; 
		// hex code for minimize symbol
		min_max_btn.innerHTML = glyphicon.minimize; 
		min_max_btn.title = "Minimize Card";
			
	} else {
		card.style.maxHeight = cardDimension.collapsed_height;
		// hex code for maximize symbol
		min_max_btn.innerHTML = glyphicon.maximize; 
		min_max_btn.title = "Maximize Card";
	}
	
}

function EDITorSAVE(edit_save_btn) {
	var card = edit_save_btn.parentNode;
	var min_max_btn = edit_save_btn.previousElementSibling;
	var editable_content = card.lastElementChild;
	var review_textarea = editable_content.firstElementChild;
	var delete_discard_btn = editable_content.previousElementSibling;

	if (edit_save_btn.title == "Edit Card") {		
		// hex code for check symbol (the pencil becomes check symbol when in edit mode)
		edit_save_btn.innerHTML = glyphicon.save; 
		edit_save_btn.title = "Save Changes";
		// increasing the card max-height, this allows the textarea to be visible
		card.style.maxHeight = cardDimension.edit_mode_height; 
		// hex code for minimize symbol
		min_max_btn.innerHTML = glyphicon.minimize; 
		min_max_btn.title = "Minimize Card";
		// can't minimize when in edit mode
		min_max_btn.style.visibility = "hidden"; 
		// when in edit mode readOnly should be set to false to make it editable
		review_textarea.readOnly = false; 
		// hex code for Ballot symbol
		delete_discard_btn.innerHTML = glyphicon.discard; 
		// when in edit mode this btn is used for discarding changes
		delete_discard_btn.title = "Discard Changes"; 
		
	} else {
		var card_info = {"rating_value":"0","review":""};
		// rating_value obtained from the className of the card
		card_info.rating_value = card.classList.item(card.classList.length-1); // length-1 is always 1
		card_info.review = review_textarea.value;
		// saving the changes to localStorage
		localStorage.setItem(card.id,JSON.stringify(card_info)); 
		// hex code for pencil symbol
		edit_save_btn.innerHTML = glyphicon.edit; 
		edit_save_btn.title = "Edit Card";
		// increasing the card max-height, this allows the rating stars to be visible
		card.style.maxHeight = cardDimension.expanded_height; 
		// hex code for minimize symbol
		min_max_btn.innerHTML = glyphicon.minimize; 
		min_max_btn.title = "Minimize Card";
		// the minimize btn is visible after editing is over
		min_max_btn.style.visibility = "visible"; 
		// when editing is over readOnly is set to true
		review_textarea.readOnly = true; 
		// hex code for Multiplication (cross) symbol
		delete_discard_btn.innerHTML = glyphicon.delete;
		delete_discard_btn.title = "Delete Card";
	}
}

function DELETEorDISCARD(delete_discard_btn) {
	var card = delete_discard_btn.parentNode;
	var edit_save_btn = delete_discard_btn.previousElementSibling;
	var min_max_btn = edit_save_btn.previousElementSibling;
	var editable_content = card.lastElementChild;
	var review_textarea = editable_content.firstElementChild;

	if (delete_discard_btn.title == "Delete Card") {
		// making sure the the mentor is sure about deleting the mentee
		if (confirm("Delete Mentee ?")) {
			// removing the mentee_name from the mentee_name_list
			for (var i = mentee_name_list.length-1; i >= 0; i--) {
				if (card.id == mentee_name_list[i]) {
					mentee_name_list.splice(i,1);
					break;
				}					
			}		
			//saving the modified name list to localStorage
			localStorage.setItem("mentee_name_list",mentee_name_list.toString()); 
			// removing the card info from localStorage
			localStorage.removeItem(card.id); 
			// removing the respective card from the DOM
			// for removing an element from DOM it's parentNode should be known, thats why parentNode of the card is accessed
			card.parentNode.removeChild(card); 
		}
	} else {
		/* for discarding, the card should be updated with the info stored in localStorage */
		var card_info = JSON.parse(localStorage.getItem(card.id));
		var rated_star = card.children[1].firstElementChild.firstElementChild;
		// updating the card's class name to hold the rating of the card
		card.className = "mentee-card " + card_info.rating_value;
		card.children[1].firstElementChild.title = rating_comment[card_info.rating_value];
		// coloring the stars
		for (var i = 1; i <= card_info.rating_value; i++, rated_star=rated_star.nextElementSibling) {
			rated_star.style.color = "chocolate";
		}
		for (var i = 1; i <= 5-card_info.rating_value; i++, rated_star=rated_star.nextElementSibling) {
			rated_star.style.color = "black";
		}
		// updating the textarea content
		review_textarea.value = card_info.review;
		// updating the bg with respective color
		card.style.backgroundColor = rating_colors[card_info.rating_value];
		// increasing the card max-height, this allows the rating stars to be visible
		card.style.maxHeight = cardDimension.expanded_height; 
		// hex code for Multiplication (cross) symbol
		delete_discard_btn.innerHTML = glyphicon.delete;
		delete_discard_btn.title = "Delete Card";
		// hex code for pencil symbol
		edit_save_btn.innerHTML = glyphicon.edit; 
		edit_save_btn.title = "Edit Card";
		// hex code for minimize symbol
		min_max_btn.innerHTML = glyphicon.minimize; 
		min_max_btn.title = "Minimize Card";
		// the minimize btn is visible after editing is over
		min_max_btn.style.visibility = "visible"; 
		// when in edit mode is over readOnly is set to true
		review_textarea.readOnly = true; 
	}
		
}

function colorPreceedingStars(star) {
	for(; star != null;star = star.previousElementSibling) {
		star.style.color = "steelblue";
		star.style.cursor = "pointer";
	}
}
function uncolorPreceedingStars(star) {
	for(; star != null;star = star.previousElementSibling) {
		star.style.color = "black";
		star.style.cursor = "default";
	}
}
function registerRating(event) {
	// the node (in this case star) that was clicked on
	var rating_star = event.target; 
	// value of the rating obtained from the class of the node (star)
	var rating_value = rating_star.className[rating_star.className.length-1]; 
	var card = rating_star.parentNode.parentNode.parentNode;
	var equivalent_rated_star = card.children[1].firstElementChild.children[rating_value-1];
	// updating the span's class name to hold the rating of the card
	card.className = "mentee-card " + rating_value;
	card.children[1].firstElementChild.title = rating_comment[rating_value];
	// coloring the stars in the titlebar
	for (var s = equivalent_rated_star,i = rating_value-1; i >= 0; i--, s = s.previousElementSibling) {
		s.style.color = "chocolate" ;
	}
	for (var s = equivalent_rated_star.nextElementSibling,i = rating_value; i < 5; i++, s = s.nextElementSibling) {
		s.style.color = "black" ;
	}
	// updating the bg with resp color
	card.style.backgroundColor = rating_colors[rating_value];
}

function deleteAll() {
	if(confirm("Delete all Mentees ?")) { // making sure that the mentor really wanted to delete all
		var card;
		for (var i = mentee_name_list.length-1; i >= 0; i--) {
			// selecting the card to be removed
			card = document.getElementById(mentee_name_list[i]);
			// removing the card info from localStorage
			localStorage.removeItem(card.id); 
			// removing the respective card from the DOM
			card.parentNode.removeChild(card); 
		}
		// removing all the names from the array
		mentee_name_list.splice(0);
		// removing the mentee_name_list item from localStorage
		localStorage.removeItem("mentee_name_list"); 
	}
}

function sort() {
	// temp array for sorting
	var sorted_mentee_name_list = [];
	// removing all cards from DOM
	for (var i = 0,card; i < mentee_name_list.length; i++) {
		// copying the names into temp array
		sorted_mentee_name_list[i] = mentee_name_list[i];
		// removing the card
		card = document.getElementById(mentee_name_list[i]);
		card.parentNode.removeChild(card);
	}
	// sorting the name list using bubble sort
	for (var i = 0 ; i < sorted_mentee_name_list.length-1 ; i++) {
		for (var j = 0,temp ; j < sorted_mentee_name_list.length-1-i ; j++) {
			if(JSON.parse(localStorage.getItem(sorted_mentee_name_list[j])).rating_value < JSON.parse(localStorage.getItem(sorted_mentee_name_list[j+1])).rating_value) {
				temp = sorted_mentee_name_list[j];
				sorted_mentee_name_list[j] = sorted_mentee_name_list[j+1];
				sorted_mentee_name_list[j+1] = temp;
			}
		}
	}
	// creating cards in the order of sorted name list
	for (var i = 0 ; i < sorted_mentee_name_list.length ; i++) {
		createCard(sorted_mentee_name_list[i],localStorage.getItem(sorted_mentee_name_list[i]));
	}
	
}

function searchCard() {
	alert("search successful");
}