import { generateShareLink, consumeShareLink } from "./modules/share.js";

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
		tf2: [":Tf2key:", "🗝️", "tf2 keys"],
		sent: ["🎮 ", "🎮 ", "(sent) "],
		paid: ["💸 ", "💸 ", "(paid) "],
		done: ["☑️ ", "☑️ ", "(done) "],
};

var gamesToClaim = [];
var link = {
	url: "",
	valid: false
};

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
 Array.from(document.getElementsByClassName("gg-img")).forEach(i => i.src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAXYAAADYCAYAAAD/P8hPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTEwLTE2VDE1OjUzOjI3LTA1OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0xMC0xNlQxNTo1NjoyNC0wNTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0xMC0xNlQxNTo1NjoyNC0wNTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplN2EzNWNiYy1hYjRk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");
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
	let url = `https://smushi.es/split/splits/${shared}.json`;
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