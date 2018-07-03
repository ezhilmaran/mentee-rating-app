/* to avoid typos becoming a variable, cuz in js a non-keyword without a declaration is also considered a variable
   eg : var x = 5; is same as just x = 5; */
'use strict'

var rating_colors = ["#cd3333","#ff7d4d","#ffd365","#c2c264","#70b234"]; // color of card for every rating

// info is obtained from localStorage on start or refresh
var mentee_name_list = localStorage.getItem("mentee_name_list");

/* should create cards everytime for saved mentees everytime on refresh */
if (mentee_name_list === null) { /* if no such item exist*/
	// initialize it to an empty array
	mentee_name_list = []; 
} else { 
	// converting mentee_name_list string to array 
	mentee_name_list = mentee_name_list.split(","); 
	for (var i = 0 ; i < mentee_name_list.length ; i++) {
		/* creating cards by adding a div to the DOM */
		createCard(mentee_name_list[i],localStorage.getItem(mentee_name_list[i])); 
	}
}
/* when a new card is added a div.mentee-card (this is the way of representing a tag belonging to a class) is added to the body with a 
   div.card-titlebar as it's 1st child holding the mentees name and his rating, 3 buttons with proper html entity as its text node, a 
   textarea to hold the review and stars to register mentee's rating */
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
		} else {
			alert("Mentee Already Exist");
		}
	} else {
		// user hit cancel
	}
}	

function createCard(mentee_name,card_info) {
	// look into JSON
	card_info = JSON.parse(card_info);
	document.getElementById("cardContainer").innerHTML += "<div id='" + mentee_name + "' class='mentee-card'>\
																<div class='card-titlebar'>" + mentee_name + " &#x2012\
																	<span class='rated-stars'>\
																		<span id='rated-star-1' class='rated-star' title='Poor'>&#x2605\
																		</span>\
																		<span id='rated-star-2' class='rated-star' title='Below Average'>&#x2605\
																		</span>\
																		<span id='rated-star-3' class='rated-star' title='Average'>&#x2605\
																		</span>\
																		<span id='rated-star-4' class='rated-star' title='Good'>&#x2605\
																		</span>\
																		<span id='rated-star-5' class='rated-star' title='Very Good'>&#x2605\
																		</span>\
																	<span/>\
																	<span id='0' class='rating-value'></span>\
																</div>\
																<button class='maximize-minimize-card-btn card-btn' title='Maximize Card' onclick='MAXIMIZEorMINIMIZEcard(this)'>&#x26F6;\
																</button>\
																<button class='edit-card-save-changes-btn card-btn' title='Edit Card' onclick='EDITorSAVE(this)'>&#x270E;\
																</button>\
																<button class='delete-card-discard-changes-btn card-btn' title='Delete Card' onclick='DELETEorDISCARD(this)'>&#x2715;\
																</button>\
																<div class='editable-content'>\
																	<textarea class='card-textarea' readOnly>" + card_info.review + "\
																	</textarea>\
																	<span class='rating-stars' onclick='registerRating(event)'>\
																		<span id='rating-star-1' class='rating-star' title='Poor'>&#x2605\
																		</span>\
																		<span id='rating-star-2' class='rating-star' title='Below Average'>&#x2605\
																		</span>\
																		<span id='rating-star-3' class='rating-star' title='Average'>&#x2605\
																		</span>\
																		<span id='rating-star-4' class='rating-star' title='Good'>&#x2605\
																		</span>\
																		<span id='rating-star-5' class='rating-star' title='Very Good'>&#x2605\
																		</span>\
																	</span>\
																</div>\
														   </div>"; 
	/* 'this' keyword returns the respective node and can be used for further manipulation */
	/* onclick is an attribute the calls the function when the resp node is clicked */
	var card = document.getElementById(mentee_name);
	// rating_value = 0 => not yet rated, lightgrey color
	if (card_info.rating_value !== "0") {
		// coloring the stars
		for (var i=card_info.rating_value,s=card.firstElementChild.firstElementChild.firstElementChild; i > 0; i--, s=s.nextElementSibling) {
			s.style.color = "chocolate" ;
		}
		// updating the bg to respective color
		card.style.backgroundColor = rating_colors[card_info.rating_value-1];
	}
	// the span.rating-value is what i use to obtain the rating of the card while saving
	// ofc i can get the rating from the number of stars colored, but doing that is just a waste of time
	// i also tried getting the rating_value from bg of the card, but JS DOM backgroundColor return format is not consistent
	// so i added a span with no textNode, just to reflect the rating_value of the card

	card.firstElementChild.lastElementChild.id = card_info.rating_value;
}						

function MAXIMIZEorMINIMIZEcard(min_max_btn) {

	if (min_max_btn.title == "Maximize Card") {
		// increasing the card max-height, this allows the textarea to be visible
		min_max_btn.parentNode.style.maxHeight = "345px"; 
		// hex code for minimize symbol
		min_max_btn.innerHTML = "&#x1f5d5;"; 
		min_max_btn.title = "Minimize Card";
	} else {
		min_max_btn.parentNode.style.maxHeight = "70px";
		// hex code for maximize symbol
		min_max_btn.innerHTML = "&#x26F6;"; 
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
		edit_save_btn.innerHTML = "&#x2713;"; 
		edit_save_btn.title = "Save Changes";
		// increasing the card max-height, this allows the textarea to be visible
		card.style.maxHeight = "400px"; 
		// hex code for minimize symbol
		min_max_btn.innerHTML = "&#x1f5d5;"; 
		min_max_btn.title = "Minimize Card";
		// can't minimize when in edit mode
		min_max_btn.style.visibility = "hidden"; 
		// when in edit mode readOnly should be set to false to make it editable
		review_textarea.readOnly = false; 
		// hex code for Ballot (kinda cross) symbol
		delete_discard_btn.innerHTML = "&#x2717;"; 
		// when in edit mode this btn is used for discarding changes
		delete_discard_btn.title = "Discard Changes"; 
		
	} else {
		var card_info = {"rating_value":"0","review":""};
		var card_titlebar = card.firstElementChild;
		var rating_value_span = card_titlebar.lastElementChild;
		var star = card.firstElementChild.firstElementChild.firstElementChild;

		// rating_value obtained from the id of span.reting-value of the card
		card_info.rating_value = rating_value_span.id;
		card_info.review = review_textarea.value;
		// saving the changes to localStorage
		localStorage.setItem(card.id,JSON.stringify(card_info)); 
		// hex code for pencil symbol
		edit_save_btn.innerHTML = "&#x270E;"; 
		edit_save_btn.title = "Edit Card";
		// increasing the card max-height, this allows the rating stars to be visible
		card.style.maxHeight = "345px"; 
		// hex code for minimize symbol
		min_max_btn.innerHTML = "&#x1f5d5;"; 
		min_max_btn.title = "Minimize Card";
		// the minimize btn is visible after editing is over
		min_max_btn.style.visibility = "visible"; 
		// when editing is over readOnly is set to true
		review_textarea.readOnly = true; 
		// hex code for Multiplication (cross) symbol
		delete_discard_btn.innerHTML = "&#x2715;";
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
		// making sure the the mentor is sure about deleteing the mentee
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
		var rated_star = card.firstElementChild.firstElementChild.firstElementChild;
		// coloring the stars
		for (var i = 1; i <= card_info.rating_value; i++, rated_star=rated_star.nextElementSibling) {
			rated_star.style.color = "chocolate";
		}
		for (var i = 1; i <= 5-card_info.rating_value; i++, rated_star=rated_star.nextElementSibling) {
			rated_star.style.color = "black";
		}
		// updating the span.rating-value's id
		card.firstElementChild.lastElementChild.id = card_info.rating_value;
		// updating the textarea content
		review_textarea.value = card_info.review;
		// updating the bg with respective color
		if (card_info.rating_value !== "0") {
			card.style.backgroundColor = rating_colors[card_info.rating_value-1];
		} 
		else {
			card.style.backgroundColor = "lightgrey";
		}
		// increasing the card max-height, this allows the rating stars to be visible
		card.style.maxHeight = "345px"; 
		// hex code for Multiplication (cross) symbol
		delete_discard_btn.innerHTML = "&#x2715;";
		delete_discard_btn.title = "Delete Card";
		// hex code for pencil symbol
		edit_save_btn.innerHTML = "&#x270E;"; 
		edit_save_btn.title = "Edit Card";
		// hex code for minimize symbol
		min_max_btn.innerHTML = "&#x1f5d5;"; 
		min_max_btn.title = "Minimize Card";
		// the minimize btn is visible after editing is over
		min_max_btn.style.visibility = "visible"; 
		// when in edit mode is over readOnly is set to true
		review_textarea.readOnly = true; 
	}
		
}

function registerRating(event) {
	// the node (in this case star) that was clicked on
	var rating_star = event.target; 
	// value of the rating obtained from the id of the node (star)
	var rating_value = rating_star.id[rating_star.id.length-1]; 
	var card = rating_star.parentNode.parentNode.parentNode;
	var card_titlebar = card.firstElementChild;
	var equivalent_rated_star = card_titlebar.firstElementChild.children[rating_value-1];
	var rating_value_span = card_titlebar.lastElementChild;
	// span.rating-value's id is updated
	rating_value_span.id = rating_value;
	// coloring the stars in the titlebar
	for (var s = equivalent_rated_star,i = rating_value-1; i >= 0; i--, s = s.previousElementSibling) {
		s.style.color = "chocolate" ;
	}
	for (var s = equivalent_rated_star.nextElementSibling,i = rating_value; i < 5; i++, s = s.nextElementSibling) {
		s.style.color = "black" ;
	}
	// updating the bg with resp color
	card.style.backgroundColor = rating_colors[rating_value-1];
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
	alert("sorting functionality not yet added");
/*
	// temp array for sorting
	var sorted_mentee_name_list = [];
	// remove all cards from DOM first
	for (var i = mentee_name_list.length-1,card; i >= 0; i--) {
		// copying the names into temp array
		sorted_mentee_name_list[i] = mentee_name_list[i];
		card = document.getElementById(mentee_name_list[i]);
		// removing the card
		card.parentNode.removeChild(card);
	}
	// sorting the name list using buble sort
	for (var i = 0 ; i < sorted_mentee_name_list.length-1 ; i++) {
		for (var j = 0,temp ; j < sorted_mentee_name_list.length-1-i ; j++) {
			if(JSON.parse(localStorage.getItem(sorted_mentee_name_list[j])).rating_value < JSON.parse(localStorage.getItem(sorted_mentee_name_list[j+1])).rating_value) {
				temp = sorted_mentee_name_list[j];
				sorted_mentee_name_list[j] = sorted_mentee_name_list[j+1];
				sorted_mentee_name_list[j+1] = temp;
			}
		}
	}
	console.log(sorted_mentee_name_list.toString());
	// creating cards in the order of sorted name list
	for (var i = 0 ; i < sorted_mentee_name_list.length ; i++) {
		createCard(sorted_mentee_name_list[i],localStorage.getItem(sorted_mentee_name_list[i]));
	}
*/	
}