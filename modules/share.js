function generateShareLink(data) {
	let contents = {
		params: {
			currency: data.params.currency
		},
		bundle: {
			byob: data.bundle.byob,
			discount: data.bundle.discount,
			games: data.bundle.games.map(g => ({...g, claims: []})),
			price: data.bundle.price,
			type: data.bundle.type
		}
	};
	request= new XMLHttpRequest();
	request.open("POST", "/split/splits/split.php", true);
	request.setRequestHeader("Content-type", "application/json");
	request.onreadystatechange = () => {
		if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			link.url = `${document.location}?share=${request.response}`;
			link.valid = true;
			localStorage.setItem('link', JSON.stringify(link));
			document.getElementById("linkValid").classList.remove("border-warning");
			document.getElementById("genLink").disabled = link.valid;
		    document.getElementById("shareLink").value = link.url;
		}
	};
	request.send(JSON.stringify(contents));
}

function consumeShareLink(sharedData) {
	if (typeof sharedData?.params?.currency !== "string" || typeof sharedData.bundle.byob !== "number" || typeof sharedData.bundle.discount !== "number" || typeof sharedData.bundle.price !== "number" || typeof sharedData.bundle.type !== "number")
		throw new Error("Failed to check share link! (1)");
			
	sharedData.bundle.games.forEach(g => {
		if (typeof g.name !== "string" || typeof g.value !== "number" || typeof g.price !== "number" || typeof g.priceOverride !== "boolean")
			throw new Error("Failed to check share link! (2)");
	});
	
	switch(sharedData.params.currency) {
		case "USD":
		case "EUR":
		case "GBP": data.params.currency = sharedData.params.currency; break;
		default: throw new Error("Invalid Currency");
	}
	
	if (sharedData.bundle.byob > 0 && sharedData.bundle.byob < 100)
		data.bundle.byob = sharedData.bundle.byob;
		
	data.bundle.discount = parseFloat(sharedData.bundle.discount) || 0;
	data.bundle.price = parseFloat(sharedData.bundle.price) || 0;
	
	if (sharedData.bundle.type == 0 || sharedData.bundle.type == 1)
		data.bundle.type = sharedData.bundle.type;
		
	data.bundle.games = [];
	
	sharedData.bundle.games.forEach(g => {
		data.bundle.games.push({
			name: g.name,
			value: parseFloat(g.value) || 0,
			price: parseFloat(g.price) || 0,
			priceOverride: g.priceOverride === true ? true : false,
			claims: []
		});
	});
	
	data.claimers = [];
}

export { generateShareLink, consumeShareLink };