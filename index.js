var data = {
	params: {
		currency: "USD",
		paypal: true,
		paypalGS: true,
		paypalMin: 0.20,
		gems: true,
		gemsPrice: 0.24,
		keys: true,
		keysPrice: 7500,
		comments: "",
		commentsBottom: 0,
		emoji: 0,
		text: 0,
		hidePricing: false
	},
	bundle: {
		name: "",
		type: 0,
		price: 0,
		discount: 0,
		ratio: 0,
		count: 1,
		byob: 3,
		games: [{
			name: "",
			value: 0,
			price: 0,
			priceOverride: false,
			claims: []
		}]
	},
	claimers: []
};

const emoji = {
		gems: [":Gems:", "💎", "gems"],
		sacks: [":Sackofgems:", "1000💎", "sack of gems"],
		tf2: [":Tf2key:", "🔑", "tf2 keys"],
		sent: ["🎮", "🎮", "(sent)"],
		paid: ["💸", "💸", "(paid)"],
		done: ["☑️", "☑️", "(done)"],
};

var gamesToClaim = [];
var link = {
	url: "",
	valid: false
};
var barterBundles = [];

function validate(name, value, index = -1) {
	switch(name) {
		case "bundle.price": data.bundle.price = parseFloat(value) || 0; link.valid = false; break;
		case "bundle.discount": data.bundle.discount = parseFloat(value / 100) || 0; link.valid = false; break;
		case "bundle.count": data.bundle.count = parseInt(value) || 0; break;
		case "params.hidePricing": data.params.hidePricing = value; break;
		case "params.paypal": data.params.paypal = value; break;
		case "params.paypalGS": data.params.paypalGS = value; break;
		case "params.paypalMin": data.params.paypalMin = parseFloat(value) || 0; break;
		case "params.revolut": data.params.revolut = value; break;
		case "params.gems": data.params.gems = value; break;
		case "params.keys": data.params.keys = value; break;
		case "params.gemsPrice": data.params.gemsPrice = parseFloat(value) || 0; break;
		case "params.keysPrice": data.params.keysPrice = parseFloat(value) || 0; break;
		case "params.currency": data.params.currency = value; link.valid = false; break;
		case "params.comments": data.params.comments = value; break;
		case "params.commentBottom": data.params.commentBottom = value; break;
		case "games.name": data.bundle.games[index - 1].name = value; link.valid = false; break;
		case "games.value": data.bundle.games[index - 1].value = parseFloat(value) || 0; link.valid = false; break;
		case "games.price": data.bundle.games[index - 1].price = parseFloat(value) || 0; link.valid = false; break;
		case "bundle.byob": data.bundle.byob = parseInt(value) || 0; link.valid = false; break;
		case "params.emoji": data.params.emoji = value; break;
		case "params.text": data.params.text = value; break;
	}


	reCalc(false);
	popForm(name, index);
}

function changeCurr() {
	Array.from(document.getElementsByClassName("curr")).forEach(e => e.textContent = getCurr(data.params.currency));
	document.getElementById("currency").value = data.params.currency;
}

function getCurr(c) {
	let curr = "$";
	switch(c) {
		case "USD": curr = "$"; break;
		case "EUR": curr = "€"; break;
		case "GBP": curr = "£"; break;
	}
	return curr;
}

function popForm(ignore = "", index = -1) {
	changeCurr();
	if (data.params.text == 1) {
		data.params.emoji = Math.max(data.params.emoji, 1);
		document.getElementById("emojiD").disabled = true;
	}
	else
		document.getElementById("emojiD").disabled = false;
	if (ignore != "bundle.price") document.getElementById("bPrice").value = formatCurr(data.bundle.price);
	if (ignore != "bundle.discount") document.getElementById("discount").value = data.bundle.discount * 100;
	document.getElementById("hidePricing").checked = data.params.hidePricing;
	document.getElementById("paypal").checked = data.params.paypal;
	document.getElementById("revolut").checked = data.params.revolut;
	document.getElementById("gems").checked = data.params.gems;
	document.getElementById("keys").checked = data.params.keys;
	data.params.paypalGS ? document.getElementById("paypalGS").checked = true : document.getElementById("paypalFF").checked = true;
	if (ignore != "params.paypalMin") document.getElementById("ppMin").value = formatCurr(data.params.paypalMin);
	if (ignore != "params.gemsPrice") document.getElementById("gemPrice").value = formatCurr(data.params.gemsPrice);
	if (ignore != "params.keyPrice") document.getElementById("keyPrice").value = data.params.keysPrice;
	document.getElementById("byob").checked = data.bundle.type == 1;
	if (ignore != "bundle.byob") document.getElementById("byobC").value = data.bundle.type != 1 ? null : data.bundle.byob;
	document.getElementById("byobC").disabled = data.bundle.type != 1;
	if (ignore != "bundle.count") document.getElementById("bundleCount").value = data.bundle.count;
	
	switch(data.params.emoji) {
		case -1:
		case 0: document.getElementById("emojiD").checked = true; break;
		case 1: document.getElementById("emojiE").checked = true; break;
		case 2: document.getElementById("emojiT").checked = true; break;
	}
	switch(data.params.text) {
		case -1:
		case 0: document.getElementById("textD").checked = true; break;
		case 1: document.getElementById("textS").checked = true; break;
	}

	data.params.paypal
		? document.getElementById("paypalOptions").classList.remove("hide")
		: document.getElementById("paypalOptions").classList.add("hide");
	data.params.paypal && data.params.paypalGS
		? document.getElementById("minOptions").classList.remove("hide")
		: document.getElementById("minOptions").classList.add("hide");
	if (data.params.gems) {
		document.getElementById("steamOptions").classList.remove("hide");
		document.getElementById("keys").checked = data.params.keys;
		document.getElementById("keys").disabled = false;
	} else {
		document.getElementById("steamOptions").classList.add("hide");
		document.getElementById("keys").checked = false;
		document.getElementById("keys").disabled = true;
	}
	data.params.keys
		? document.getElementById("keyOptions").classList.remove("hide")
		: document.getElementById("keyOptions").classList.add("hide");
		
	if (ignore != "params.comments") document.getElementById("comments").value = data.params.comments;
	data.params.commentBottom
		? document.getElementById("commentBottom").checked = true
		: document.getElementById("commentTop").checked = true;
	

	let gamesDisplay = document.getElementById("games").rows.length - data.bundle.games.length - 1;
	if (gamesDisplay < 0) {
		while (document.getElementById("games").rows.length < data.bundle.games.length + 1)
			add(-2, false);
	}
	else if (gamesDisplay > 0) {
		while (document.getElementById("games").rows.length + 1 > data.bundle.games.length)
			rem(-1, false);
	}

	let names = document.getElementsByClassName("tg");
	let values = document.getElementsByClassName("tv");
	let prices = document.getElementsByClassName("tp");
	for (let i = 0; i < data.bundle.games.length; i++) {
		let game = data.bundle.games[i];
		if (ignore != "games.name" || i != index - 1) names[i].value = game.name;
		if (ignore != "games.value" || i != index - 1) values[i].value = data.bundle.type == 1 ? null : formatCurr(game.value);
		values[i].disabled = data.bundle.type == 1 || game.priceOverride;
		if (ignore != "games.price" || i != index - 1) prices[i].value = formatCurr(game.price);
		prices[i].readOnly = !game.priceOverride;
	}
	
	Array.from(document.getElementsByClassName("ggButton")).forEach(b => b.disabled = data.bundle.type == 1);
	
	document.getElementById("linkValid").textContent = link.valid ? "Current" : "Outdated";
	link.valid
		? document.getElementById("linkValid").classList.remove("border-warning")
		: document.getElementById("linkValid").classList.add("border-warning");

	document.getElementById("genLink").disabled = link.valid;
	document.getElementById("shareLink").value = link.url;
	
	setOverrides();
	buildClaims();
	buildText();
	localStorage.setItem('data', JSON.stringify(data));
	localStorage.setItem('link', JSON.stringify(link));
	document.getElementById("exportBox").value = JSON.stringify(data);
	addGGs();
}

function list() {
	let games = document.getElementById("list").value.split("\n");
	if (!games || games.length == 0) return;
	
	while (data.bundle.games.length < games.length) data.bundle.games.push({
		name: "",
		value: 0,
		price: 0,
		priceOverride: false,
		claims: []
	});
	
	for (let i = 0; i < games.length; i++)
		data.bundle.games[i].name = games[i];
	
	reCalc();
}

function reCalc(pop = true) {
	let bundlePrice = data.bundle.discount != 1 ? data.bundle.price * (1 - data.bundle.discount) : 0;
	
	switch (data.bundle.type) {
		case 0:
			let sum = data.bundle.games.reduce((s, g) => g.priceOverride ? s : s + g.value, 0);
			bundlePrice -= data.bundle.games.reduce((s, g) => g.priceOverride ? s + g.price : s, 0);
			data.bundle.ratio = sum != 0 ? bundlePrice / sum : 0;
			data.bundle.games.forEach(g => { if (!g.priceOverride) g.price = Math.ceil(g.value * data.bundle.ratio * 100) / 100});
			break;
		case 1:
			if (!(data.bundle.byob > 0)) data.bundle.byob = data.bundle.games.length;
			data.bundle.games.forEach(g => g.price = Math.ceil((bundlePrice / data.bundle.byob) * 100) / 100);
			break;
	}
	
	if (pop) popForm();
}

function override(i) {
	data.bundle.games[i - 1].priceOverride = !data.bundle.games[i - 1].priceOverride;
	reCalc();
}

function rem(i, calc = true) {
	
	data.bundle.games.splice(i - 1, 1);
	if (i > 1) document.getElementById("games").deleteRow(i);

	if (calc) reCalc();
}

function countChars() {
	let cnt = document.getElementById("copy").value.length;
	let b1 = document.getElementById("progressP");
	let b2 = document.getElementById("progressN");
	let b3 = document.getElementById("progressO");
	if (cnt <= 2000) {
		b1.children[0].textContent = cnt;
		b1.style.width = `${Math.max((cnt / 2000) * 70, 10)}%`;
		b2.children[0].textContent = "";
		b2.style.width = "0";
		b3.children[0].textContent = "";
		b3.style.width = "0";
	} else if (cnt <= 4000) {
		b1.children[0].textContent = "";
		b1.style.width = "70%";
		b2.children[0].textContent = cnt;
		b2.style.width = `${Math.max(((cnt - 2000) / 2000) * 20, 10)}%`;
		b3.children[0].textContent = "";
		b3.style.width = "0";
	}
	else {
		b1.children[0].textContent = "";
		b1.style.width = "70%";
		b2.children[0].textContent = "";
		b2.style.width = "20%";
		b3.children[0].textContent = cnt;
		b3.style.width = "10%";
	}
}

function formatCurr(value, symbol = false) {
	let f = value.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
	
	if (symbol)
		f = data.params.currency == "EUR"
			? `${value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}${getCurr(data.params.currency)}`
			: `${getCurr(data.params.currency)}${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
			
	return f;
}

function boldify(text) {
	switch (data.params.text) {
		case 0: return `**${text}**`;
		case 1: return `[u]${text}[\/u]`;
	}
}

function gobbleShared(input) {
	if (typeof input?.params?.currency !== "string" || typeof input.bundle.byob !== "number" || typeof input.bundle.discount !== "number" || typeof input.bundle.price !== "number" || typeof input.bundle.type !== "number")
		throw new Error("Failed to check share link! (1)");
			
	input.bundle.games.forEach(g => {
		if (typeof g.name !== "string" || typeof g.value !== "number" || typeof g.price !== "number" || typeof g.priceOverride !== "boolean")
			throw new Error("Failed to check share link! (2)");
	});
	
	switch(input.params.currency) {
		case "USD":
		case "EUR":
		case "GBP": data.params.currency = input.params.currency; break;
		default: throw new Error("Invalid Currency");
	}
	
	if (input.bundle.byob > 0 && input.bundle.byob < 100)
		data.bundle.byob = input.bundle.byob;
		
	data.bundle.discount = parseFloat(input.bundle.discount) || 0;
	data.bundle.price = parseFloat(input.bundle.price) || 0;
	
	if (input.bundle.type == 0 || input.bundle.type == 1)
		data.bundle.type = input.bundle.type;
		
	data.bundle.games = [];
	
	input.bundle.games.forEach(g => {
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

function buildText() {
	let taken = data.bundle.games.reduce((t,g) => t + g.claims.length, 0);
	
	let area = document.getElementById("copy");
	let a = data.bundle.type == 1 ? `${boldify('Available:')} (${data.bundle.byob * data.bundle.count - taken}/${data.bundle.byob * data.bundle.count})\n` : `${boldify('Available:')}\n`;
	let t = data.bundle.type == 1 ? `\n${boldify('Taken:')} (${taken}/${data.bundle.byob * data.bundle.count})\n` : `\n${boldify('Taken:')}\n`;
	let curr = getCurr(data.params.currency);
	let bundlePrice = data.bundle.discount != 1 ? Math.ceil(data.bundle.price * (1 - data.bundle.discount) * 100) / 100 : 0;
	let min = data.bundle.games.some(g => g.price < data.params.paypalMin)
		? `, ${formatCurr(data.params.paypalMin, true)} min`
		: "";
	let fees = data.params.paypalGS
		? `(I'll cover fees${min})`
		: "";
	
	let footer = `\n${boldify('Payment:')}\n`;
	if (data.params.paypal)
		footer += `PayPal ${data.params.currency} ${data.params.paypalGS ? "G&S" : "F&F"} ${fees}\n`;
	if (data.params.revolut)
		footer += `Revolut ${data.params.currency}\n`;
	if (data.params.gems) {
		footer += `Gems (${formatCurr(data.params.gemsPrice, true)} / ${emoji.sacks[data.params.emoji]})\n`;
		if (data.params.keys)
			footer += `TF2 Keys (${emoji.tf2[data.params.emoji]} 1:${data.params.keysPrice} ${emoji.gems[data.params.emoji]})\n`;
	}

	if (data.bundle.type == 1) {
		data.bundle.games.forEach(g => {
			if (g.claims.length < data.bundle.count)
				a += `${g.name}\n`;
			
			g.claims.forEach(c => {
				let cc = data.claimers.find(x => x.name == c);
				let ce = !cc ? "" : cc.sent ? cc.paid ? emoji.done[data.params.emoji] : emoji.sent[data.params.emoji] : cc.paid ? emoji.paid[data.params.emoji] : "";
				t += `${ce}${g.name} - ${c}\n`;
			});
		});
	}
	else {
		data.bundle.games.forEach(g => {
			let gems = Math.ceil((g.price / data.params.gemsPrice) * 1000);
			let gemsDisp = data.params.gems ? `${gems} ${emoji.gems[data.params.emoji]}` : "";
			let priceDisp = data.params.paypal || data.params.revolut ? `${formatCurr(g.price, true)}${gemsDisp ? " (" + gemsDisp + ")" : ""}` : gemsDisp;
			let gg = `${g.name}: ${priceDisp}`;
			g.claims.forEach(c => {
				let cc = data.claimers.find(x => x.name == c);
				let ce = !cc ? "" : cc.sent ? cc.paid ? emoji.done[data.params.emoji] : emoji.sent[data.params.emoji] : cc.paid ? emoji.paid[data.params.emoji] : "";
				t += `${ce}${gg} - ${c}\n`;
			});
			
			if (g.claims.length < data.bundle.count) {
				let cnt = data.bundle.count - g.claims.length - 1 ? `(${data.bundle.count - g.claims.length}x) ` : "";
				a += cnt + gg + "\n";
			}
				
		});
	}
	
	let p1 = data.bundle.games.reduce((t, g) => g.priceOverride ? t : t + g.value, 0);
	let p2 = bundlePrice - data.bundle.games.reduce((t, g) => g.priceOverride ? t + g.price : t, 0);
	
	let gems = data.params.gems ? ` (${Math.ceil((data.bundle.games[0].price / data.params.gemsPrice) * 1000)} ${emoji.gems[data.params.emoji]})\n` : "\n";
	
	let pricing = data.bundle.type == 1
		? `\n${boldify('Pricing:')} ${formatCurr(bundlePrice, true)} / ${data.bundle.byob} = ${boldify(formatCurr(data.bundle.games[0].price, true), true)}${gems}`
		: `\n${boldify('Pricing:')} ~${Math.floor(data.bundle.ratio*100)}% of gg.deals price${data.bundle.games.some(g => g.priceOverride) ? ` with ${boldify('modifications', true)}` : ""} (${formatCurr(p1, true)} / ${formatCurr(p2, true)}).\n`;
	
	let comments = data.params.comments ? data.params.commentBottom ? `\n${data.params.comments}` : `${data.params.comments}\n\n` : "";
	
	area.value = data.params.commentBottom
		? `${a}${t}${data.params.hidePricing ? "" : pricing}${footer}${comments}`
		: `${comments}${a}${t}${data.params.hidePricing ? "" : pricing}${footer}`;
	countChars();
	
	let area2 = document.getElementById("priv");
	
	let us = [];
	data.bundle.games.forEach(g => {
		if (g.claims.length > 0) g.claims.forEach(c => {
			if (!us.some(u => u.name == c))
				us.push({
					name: c,
					games: [g.name],
					price: g.price
				});
		else {
			let usn = us.find(u => u.name == c);
			usn.games.push(g.name);
			usn.price += g.price;
		}
		});
	});
	
	let p = "";
	us.forEach(u => {
		p += `User: ${u.name}\n`;
		
		let gs = "";
		u.games.forEach(g => {
			gs += `${g}: \`\`\n`;
		});
		p += gs;
		
		let pprs = data.params.paypal || data.params.revolut ? `${formatCurr(u.price, true)}` : "";
		let gems = Math.ceil((u.price / data.params.gemsPrice) * 1000);
		let keys = data.params.gems && data.params.keys && gems > data.params.keysPrice ? ` or ${Math.floor(gems / data.params.keysPrice)} ${emoji.tf2[data.params.emoji < 2 ? 1 : data.params.emoji]} + ${gems % data.params.keysPrice} ${emoji.gems[data.params.emoji < 2 ? 1 : data.params.emoji]}` : "";
		gems = data.params.gems ? data.params.paypal || data.params.revolut ? ` or ${gems} ${emoji.gems[data.params.emoji < 2 ? 1 : data.params.emoji]}` : `${gems} ${emoji.gems[data.params.emoji < 2 ? 1 : data.params.emoji]}` : "";
		
		p += `Price: ${pprs}${gems}${keys}\n\n`;
	});
	
	area2.value = p;
}

function ggp(i) {
	let link = "https://gg.deals/games/?title=";
	
	let game = data.bundle.games[i - 1];
	if (game.name.trim())
		window.open(link + game.name, "_blank");
		
	///endpoint: https://gg.deals/games/?title={{TITLE OF GAME}}
	//var regex = /Official Stores:.*?(\d{1,3}\.?\d\d)[\S\s]*?Keyshops:.*?(\d{1,3}\.?\d\d)/gm;
	//[...Array.from(document.querySelectorAll('div')).find(el => el.textContent.includes('Official Stores:')).textContent.matchAll(regex)][0][1]
}

function setClaim(i) {
	if(document.getElementById(`option${i}`).checked)
		gamesToClaim.push(i);
	else
		gamesToClaim = gamesToClaim.filter(e => e !== i);
	
	document.getElementById("claimB").disabled = gamesToClaim.length == 0;
}

function doClaim() {
	let n = document.getElementById("username").value.trim();
	
	if (!n) return;
	
	gamesToClaim.forEach(i => {
		data.bundle.games[i].claims.push(n);
	});
	
	if (!data.claimers.some(c => c.name == n)) {
		data.claimers.push({
			name: n,
			paid: false,
			sent: false
		});
	}
	gamesToClaim = [];
	popForm();
}

function doUnclaim(all = false) {
	let n = document.getElementById("username").value.trim();
	
	if (!n && !all) return;
	
	if (all) {
		data.bundle.games.forEach(g => g.claims = []);
		data.claimers = [];
	}
	else {
		data.bundle.games.forEach(g => g.claims = g.claims.filter(e => e !== n));
		data.claimers = data.claimers.filter(e => e.name !== n);
	}
	
	
	gamesToClaim = [];
	popForm();
}

function setGG() {
	document.getElementById("ggB").disabled = document.getElementById("agree").checked ? false : true;
}

function imp() {
	let box = JSON.parse(document.getElementById("exportBox").value);
	if (box) data = data = {
		params: {...data.params, ...box.params},
		bundle: {...data.bundle, ...box.bundle},
		claimers: box.claimers ? box.claimers : data.claimers
	};
		
	reCalc();
}

function pay(i, paid, el) {
	if (paid)
		data.claimers[i].paid = el.checked;
	else
		data.claimers[i].sent = el.checked;
		
	popForm();
}

function byob() {
	data.bundle.type = document.getElementById("byob").checked ? 1 : 0;
	link.valid = false;
	reCalc();
}

function buildClaims() {
	document.getElementById("claimB").disabled = gamesToClaim.length == 0;
	document.getElementById("claimGamesDiv").innerHTML = "";
	document.getElementById("claimersDiv").innerHTML = "";
	
	let cers = "";
	data.claimers.forEach((c, i) => {
		let c1 = c.sent ? "checked" : "";
		let c2 = c.paid ? "checked" : "";
		let cer = `<div class="btn-group" role="group">`
		+ `<span class="btn btn-light disabled">${c.name}</span>`
		+ `<input type="checkbox" class="btn-check" id="cs${i}" autocomplete="off" onchange="pay(${i}, 0, this)" ${c1}><label class="btn btn-outline-secondary" for="cs${i}">Sent</label>`
		+ `<input type="checkbox" class="btn-check" id="cp${i}" autocomplete="off" onchange="pay(${i}, 1, this)"  ${c2}><label class="btn btn-outline-secondary" for="cp${i}">Paid</label>`;
		cers += cer + "</div>";
	});
	
	document.getElementById("claimersDiv").innerHTML = cers;
	
	let buttons = "";
	data.bundle.games.forEach((g, i) => {
		if (g.name.trim()) {
			let dis = g.claims.length >= data.bundle.count ? "disabled" : "";
			let button = `<input type="checkbox" class="btn-check cls" id="option${i}" autocomplete="off" onchange="setClaim(${i})" ${dis}>`
			+ `<label class="btn btn-outline-secondary" for="option${i}">${g.name}`;
			let names = "";
			g.claims.forEach(c => {
				let cc = data.claimers.find(x => x.name == c);
				let ce = !cc ? "" : cc.sent ? cc.paid ? "☑️" : "🎮" : cc.paid ? "💸" : "";
				let name = ` <span class="badge text-bg-danger">${c} ${ce}</span>`;
				names += name;
			});
			buttons += button + names + "</label>";
		}
	});
	
	document.getElementById("claimGamesDiv").innerHTML = buttons;
}

function setOverrides() {
	Array.from(document.getElementsByClassName("p-override")).forEach((b, i) => {
		b.disabled = data.bundle.type == 1;
		
		if (data.bundle.games[i].priceOverride) {
			b.classList.add("btn-secondary");
			b.classList.remove("btn-outline-secondary");
		}
		else {
			b.classList.add("btn-outline-secondary");
			b.classList.remove("btn-secondary");
		}
		
		b.innerHTML = data.bundle.games[i].priceOverride
		? `<i class="bi bi-eraser"></i>`
		: `<i class="bi bi-pencil-square"></i>`;
	});
}

function add(i, b = true) {
	if (b) data.bundle.games.splice(i, 0, {
		name: "",
		value: 0,
		price: 0,
		priceOverride: false,
		claims: []
	});

	let table = document.getElementById("games");
	let row = table.insertRow(i+1);
	let c1 = row.insertCell(0);
	let c2 = row.insertCell(1);
	let c3 = row.insertCell(2);
	let c4 = row.insertCell(3);
	
	c1.innerHTML = `<input type="text" class="form-control tg" oninput="validate('games.name', this.value, this.closest('tr').rowIndex)" onblur="popForm()">`;
	c2.innerHTML = `<div class="input-group"><span class="input-group-text curr">$</span><input type="number" class="form-control tv" step="any" oninput="validate('games.value', this.value, this.closest('tr').rowIndex)" onblur="popForm()"><button class="btn btn-outline-secondary ggButton" type="button" onclick="ggp(this.closest('tr').rowIndex)"><img class="gg-img" alt="gg.deals" width=30></button></div>`;
	c3.innerHTML = `<div class="input-group"><span class="input-group-text curr">$</span><input class="form-control tp" step="any" oninput="validate('games.price', this.value, this.closest('tr').rowIndex)" onblur="popForm()"><button type="button" class="btn btn-outline-secondary p-override" onclick="override(this.closest('tr').rowIndex)">a</button></div>`;
	
	c4.innerHTML = `<div class="btn-group" role="group" aria-label="Basic example"><button type="button" class="btn btn-outline-secondary aa" onclick="add(this.closest('tr').rowIndex)"><i class="bi bi-plus-circle"></i></button><button type="button" class="btn btn-outline-secondary" onclick="rem(this.closest('tr').rowIndex)"><i class="bi bi-trash"></i></button></div>`;

	if (b) reCalc();
}

function addGGs() {
 Array.from(document.getElementsByClassName("gg-img")).forEach(i => i.src = "/split/gg.png");
}

function fetchBundles() {
	let req = new XMLHttpRequest();
	req.open("GET", "https://barter.vg/bundles/json/", true);
	req.onreadystatechange = () => {
		if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
			let resp = JSON.parse(req.response).bundles;
			let now = Date.now();
			barterBundles = [];
			for (let key in resp) {
				let bun = resp[key];
				if (bun.meta.end > now) {
					let games = [];
					for (let gameKey in bun.games)
					games.push({
						id: bun.games[gameKey].id,
						item_id: bun.games[gameKey].item_id
					});
					barterBundles.push({
						id: key,
						store: bun.meta.store,
						storeName: bun.meta.storeName,
						title: bun.meta.title,
						games: games
					});
				}
			}
			let bundleSelect = document.getElementById("bundleSelect");
			barterBundles.forEach(bundle => {
				let bundleOption = document.createElement("option");
				bundleOption.value = bundle.id;
				bundleOption.innerHTML = bundle.title;
				bundleSelect.appendChild(bundleOption);
			});
		}
	};
	req.send();
}

function pickBundle() {
	
}

function generateShareLink() {
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
	let request = new XMLHttpRequest();
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

let storedData = JSON.parse(localStorage.getItem('data'));
if (storedData) data = {
	...data,
	params: {...data.params, ...storedData.params},
	bundle: {...data.bundle, ...storedData.bundle},
	claimers: storedData.claimers
};
let slink = JSON.parse(localStorage.getItem('link'));
if (slink) link = {
	url: slink?.url ?? link.url,
	valid: slink?.valid ?? link.valid
};

let urlParams = new URLSearchParams(window.location.search);
let shared = urlParams.get('share');
if (shared) {
	let url = `${document.location}/splits/${shared}.json`;
	fetch(url).then(response => response.json()).then(out => {
		consumeShareLink(out);
		link = {
			url: window.location.href,
			valid: true
		};
		reCalc();
		window.history.replaceState(null, "", "/" + window.location.href.substring(window.location.href.lastIndexOf('.') + 4).split("?")[0]);
	}).catch(err => {throw err});
}

reCalc();
document.getElementById("lastMod").textContent = (new Date(Date.parse(document.lastModified))).toUTCString();