var data = {
	params: {
		currency: "0",
		currencyOther: {
			code: "CNY",
			symbol: "¥",
			alignRight: false
		},
		paypal: true,
		paypalGS: false,
		paypalMin: 0.20,
		gems: true,
		gemsPrice: 0.24,
		keys: true,
		keysPrice: 7500,
		revolut: false,
		customPay: false,
		customPayment: "Bananas",
		comments: "",
		commentsBottom: 0,
		emoji: 0,
		customEmoji: {
			gems: "💎",
			sacks: "1000💎",
			tf2: "🔑",
			sent: "🎮",
			paid: "💸",
			done: "✅"
		},
		text: 0,
		misc: {
			available: 1,
			taken: 1,
			pricing: 1,
			payment: 1,
			forceEmojiDirect: false
		}
	},
	bundle: {
		name: "",
		type: 0,
		price: 0,
		discount: 0,
		ratio: 0,
		count: 1,
		byob: 3,
		byobPlus: true,
		games: [{
			name: "",
			value: 0,
			price: 0,
			priceOverride: false,
			claims: []
		}]
	},
	claimers: [],
	version: 4
};

const emoji = {
		gems: [":Gems:", "💎", "gems"],
		sacks: [":Sackofgems:", "1000💎", "sack of gems"],
		tf2: [":Tf2key:", "🔑", "tf2 keys"],
		sent: ["🎮", "🎮", "(sent)"],
		paid: ["💸", "💸", "(paid)"],
		done: ["✅", "✅", "(done)"]
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
		case "params.paypal": data.params.paypal = value; break;
		case "params.paypalGS": data.params.paypalGS = value; break;
		case "params.paypalMin": data.params.paypalMin = parseFloat(value) || 0; break;
		case "params.revolut": data.params.revolut = value; break;
		case "params.customPay": data.params.customPay = value; break;
		case "params.customPayment": data.params.customPayment = value; break;
		case "params.gems": data.params.gems = value; break;
		case "params.keys": data.params.keys = value; break;
		case "params.gemsPrice": data.params.gemsPrice = parseFloat(value) || 0; break;
		case "params.keysPrice": data.params.keysPrice = parseFloat(value) || 0; break;
		case "params.currency": data.params.currency = value; link.valid = false; break;
		case "currencyOther.code": data.params.currencyOther.code = value; break;
		case "currencyOther.symbol": data.params.currencyOther.symbol = value; break;
		case "currencyOther.alignRight": data.params.currencyOther.alignRight = value; break;
		case "params.comments": data.params.comments = value; break;
		case "params.commentBottom": data.params.commentBottom = value; break;
		case "games.name": data.bundle.games[index - 1].name = value; link.valid = false; break;
		case "games.value": data.bundle.games[index - 1].value = parseFloat(value) || 0; link.valid = false; break;
		case "games.price": data.bundle.games[index - 1].price = parseFloat(value) || 0; link.valid = false; break;
		case "bundle.byob": data.bundle.byob = parseInt(value) || 0; link.valid = false; break;
		case "bundle.byobPlus": data.bundle.byobPlus = value; break;
		case "params.emoji": data.params.emoji = value; break;
		case "customEmoji.gems": data.params.customEmoji.gems = value; break;
		case "customEmoji.sacks": data.params.customEmoji.sacks = value; break;
		case "customEmoji.tf2": data.params.customEmoji.tf2 = value; break;
		case "customEmoji.sent": data.params.customEmoji.sent = value; break;
		case "customEmoji.paid": data.params.customEmoji.paid = value; break;
		case "customEmoji.done": data.params.customEmoji.done = value; break;
		case "params.text": data.params.text = value; break;
		case "misc.available": data.params.misc.available = value; break;
		case "misc.taken": data.params.misc.taken = value; break;
		case "misc.pricing": data.params.misc.pricing = value; break;
		case "misc.payment": data.params.misc.payment = value; break;
		case "misc.forceEmojiDirect": data.params.misc.forceEmojiDirect = value; break;
	}

	reCalc(false);
	popForm(name, index);
}

function getEmoji(dm = false) {
	let force = data.params.misc.forceEmojiDirect && dm;
	if (force)
		return {
			gems: emoji.gems[1],
			sacks: emoji.sacks[1],
			tf2: emoji.tf2[1],
			sent: emoji.sent[1],
			paid: emoji.paid[1],
			done: emoji.done[1]
		};
	else if (data.params.emoji == 3)
		return data.params.customEmoji;
	else
		return {
			gems: emoji.gems[data.params.emoji],
			sacks: emoji.sacks[data.params.emoji],
			tf2: emoji.tf2[data.params.emoji],
			sent: emoji.sent[data.params.emoji],
			paid: emoji.paid[data.params.emoji],
			done: emoji.done[data.params.emoji]
		};
}

function changeCurr() {
	let c = getCurr(data.params.currency);
	Array.from(document.getElementsByClassName("curr")).forEach(e => e.textContent = c.symbol);
	document.getElementById("currency").value = data.params.currency;
}

function getCurr(c) {
	switch(c) {
		case "1": return {code: "EUR", symbol: "€", alignRight: true};
		case "2": return {code: "GBP", symbol: "£", alignRight: false};
		case "3": return data.params.currencyOther;
		case "0":
		default: return {code: "USD", symbol: "$", alignRight: false};
	}
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
	document.getElementById("paypal").checked = data.params.paypal;
	document.getElementById("revolut").checked = data.params.revolut;
	document.getElementById("gems").checked = data.params.gems;
	document.getElementById("keys").checked = data.params.keys;
	document.getElementById("customPay").checked = data.params.customPay;
	if (ignore != "currencyOther.code") document.getElementById("oCurrCode").value = data.params.currencyOther.code;
	if (ignore != "currencyOther.symbol") document.getElementById("oCurrSymbol").value = data.params.currencyOther.symbol;
	data.params.currencyOther.alignRight
		? document.getElementById("cRight1").checked = true
		: document.getElementById("cRight0").checked = true;
	data.params.paypalGS ? document.getElementById("paypalGS").checked = true : document.getElementById("paypalFF").checked = true;
	if (ignore != "params.paypalMin") document.getElementById("ppMin").value = formatCurr(data.params.paypalMin);
	if (ignore != "params.gemsPrice") document.getElementById("gemPrice").value = formatCurr(data.params.gemsPrice);
	if (ignore != "params.keyPrice") document.getElementById("keyPrice").value = data.params.keysPrice;
	if (ignore != "params.customPayment") document.getElementById("customPayText").value = data.params.customPayment;
	document.getElementById("byob").checked = data.bundle.type == 1;
	document.getElementById("byobPlus").checked = data.bundle.byobPlus;
	if (ignore != "bundle.byob") document.getElementById("byobC").value = data.bundle.type != 1 ? null : data.bundle.byob;
	document.getElementById("byobC").disabled = data.bundle.type != 1;
	document.getElementById("byobPlus").disabled = data.bundle.type != 1;
	if (ignore != "bundle.count") document.getElementById("bundleCount").value = data.bundle.count;
	
	switch(data.params.emoji) {
		case -1:
		case 0: document.getElementById("emojiD").checked = true; break;
		case 1: document.getElementById("emojiE").checked = true; break;
		case 2: document.getElementById("emojiT").checked = true; break;
		case 3: document.getElementById("emojiC").checked = true; break;
	}
	switch(data.params.text) {
		case -1:
		case 0: document.getElementById("textD").checked = true; break;
		case 1: document.getElementById("textS").checked = true; break;
	}
	switch(data.params.misc.available) {
		case -1:
		case 0: document.getElementById("miscAva0").checked = true; break;
		case 1: document.getElementById("miscAva1").checked = true; break;
		case 2: document.getElementById("miscAva2").checked = true; break;
	}
	switch(data.params.misc.taken) {
		case -1:
		case 0: document.getElementById("miscTak0").checked = true; break;
		case 1: document.getElementById("miscTak1").checked = true; break;
		case 2: document.getElementById("miscTak2").checked = true; break;
	}
	switch(data.params.misc.pricing) {
		case -1:
		case 0: document.getElementById("miscPri0").checked = true; break;
		case 1: document.getElementById("miscPri1").checked = true; break;
	}
	switch(data.params.misc.payment) {
		case -1:
		case 0: document.getElementById("miscPay0").checked = true; break;
		case 1: document.getElementById("miscPay1").checked = true; break;
	}
	
	if (data.params.emoji == 3) {
		data.params.gems
			? document.getElementById("customEmojiOptions1").classList.remove("hide")
			: document.getElementById("customEmojiOptions1").classList.add("hide");
		data.params.keys
			? document.getElementById("ceKeys").classList.remove("hide")
			: document.getElementById("ceKeys").classList.add("hide");
		document.getElementById("customEmojiOptions2").classList.remove("hide");
	} else {
		document.getElementById("customEmojiOptions1").classList.add("hide");
		document.getElementById("customEmojiOptions2").classList.add("hide");
	}
	if (ignore != "customEmoji.gems") document.getElementById("ceGems").value = data.params.customEmoji.gems;
	if (ignore != "customEmoji.sacks") document.getElementById("ceSacks").value = data.params.customEmoji.sacks;
	if (ignore != "customEmoji.tf2") document.getElementById("ceKeys").value = data.params.customEmoji.tf2;
	if (ignore != "customEmoji.sent") document.getElementById("ceSent").value = data.params.customEmoji.sent;
	if (ignore != "customEmoji.paid") document.getElementById("cePaid").value = data.params.customEmoji.paid;
	if (ignore != "customEmoji.done") document.getElementById("ceDone").value = data.params.customEmoji.done;

	data.params.currency == "3"
		? document.getElementById("otherCurr").classList.remove("hide")
		: document.getElementById("otherCurr").classList.add("hide");
	data.params.paypal
		? document.getElementById("paypalOptions").classList.remove("hide")
		: document.getElementById("paypalOptions").classList.add("hide");
	data.params.paypal && data.params.paypalGS
		? document.getElementById("minOptions").classList.remove("hide")
		: document.getElementById("minOptions").classList.add("hide");
	data.params.customPay
		? document.getElementById("customPayOptions").classList.remove("hide")
		: document.getElementById("customPayOptions").classList.add("hide");
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
	data.params.misc.forceEmojiDirect
		? document.getElementById("forceEmoji").checked = true
		: document.getElementById("forceEmoji").checked = false;
	
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
		while (document.getElementById("games").rows.length > data.bundle.games.length + 1)
			document.getElementById("games").deleteRow(-1);
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
	
	data.bundle.games = [];
	link.valid = false;
	games.forEach(g => data.bundle.games.push({
			name: g,
			value: 0,
			price: 0,
			priceOverride: false,
			claims: []
	}));
	
	reCalc();
}

function toggleList(op) {
	if (op) {
		document.getElementById("list1").classList.remove("hide");
		document.getElementById("list2").classList.add("hide");
	}
	else {
		document.getElementById("list1").classList.add("hide");
		document.getElementById("list2").classList.remove("hide");
	}
}

function reCalc(pop = true) {
	let bundlePrice = data.bundle.discount != 1 ? data.bundle.price * (1 - data.bundle.discount) : 0;
	
	switch (data.bundle.type) {
		case 0:
			let sum = data.bundle.games.reduce((s, g) => g.priceOverride ? s : s + g.value, 0);
			bundlePrice -= data.bundle.games.reduce((s, g) => g.priceOverride ? s + g.price : s, 0);
			data.bundle.ratio = sum != 0 ? bundlePrice / sum : 0;
			data.bundle.games.forEach(g => { if (!g.priceOverride) g.price = Math.ceil(g.value * data.bundle.ratio * 100) / 100;});
			break;
		case 1:
			if (data.bundle.byob <= 0) data.bundle.byob = data.bundle.games.length;
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
	let c = getCurr(data.params.currency);
	let f = value.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
	
	if (symbol)
		f = c.alignRight
			? `${value.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}${c.symbol}`
			: `${c.symbol}${value.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}`;
			
	return f;
}

function boldify(text) {
	switch (data.params.text) {
		case 0: return `**${text}**`;
		case 1: return `[u]${text}[\/u]`;
	}
}

function buildText() {
	let taken = data.bundle.games.reduce((t,g) => t + g.claims.length, 0);
	let plusIcon = data.bundle.byobPlus ? "+" : "";
	
	let area = document.getElementById("copy");
	let a = data.bundle.type == 1 && !data.bundle.byobPlus ? `${boldify('Available:')} (${data.bundle.byob * data.bundle.count - taken}/${data.bundle.byob * data.bundle.count})\n` : `${boldify('Available:')}\n`;
	let t = data.bundle.type == 1 ? `${boldify('Taken:')} (${taken}/${data.bundle.byob * data.bundle.count}${plusIcon})\n` : `${boldify('Taken:')}\n`;
	let curr = getCurr(data.params.currency);
	let bundlePrice = data.bundle.discount != 1 ? Math.ceil(data.bundle.price * (1 - data.bundle.discount) * 100) / 100 : 0;
	let min = data.bundle.games.some(g => g.price < data.params.paypalMin)
		? `, ${formatCurr(data.params.paypalMin, true)} min`
		: "";
	let fees = data.params.paypalGS
		? `(I'll cover fees${min})`
		: "";
	
	let payment = `${boldify('Payment:')}\n`;
	if (data.params.paypal)
		payment += `PayPal ${getCurr(data.params.currency).code} ${data.params.paypalGS ? "G&S" : "F&F"} ${fees}\n`;
	if (data.params.revolut)
		payment += `Revolut ${getCurr(data.params.currency).code}\n`;
	if (data.params.customPay)
		payment += data.params.customPayment + "\n";
	if (data.params.gems) {
		payment += `Gems (${formatCurr(data.params.gemsPrice, true)} / ${getEmoji().sacks})\n`;
		if (data.params.keys)
			payment += `TF2 Keys (${getEmoji().tf2} 1:${data.params.keysPrice} ${getEmoji().gems})\n`;
	}

	if (data.bundle.type == 1) {
		data.bundle.games.forEach(g => {
			if (g.claims.length < data.bundle.count)
				a += `${g.name}\n`;
			
			g.claims.forEach(c => {
				let cc = data.claimers.find(x => x.name == c);
				let ce = !cc ? "" : cc.sent ? cc.paid ? getEmoji().done : getEmoji().sent : cc.paid ? getEmoji().paid : "";
				if (ce.length > 0) ce += " ";
				t += `${ce}${g.name} - ${c}\n`;
			});
		});
	}
	else {
		data.bundle.games.forEach(g => {
			let gems = Math.ceil((g.price / data.params.gemsPrice) * 1000);
			let gemsDisp = data.params.gems ? `${gems} ${getEmoji().gems}` : "";
			let priceDisp = data.params.paypal || data.params.revolut || data.params.customPay ? `${formatCurr(g.price, true)}${gemsDisp ? " (" + gemsDisp + ")" : ""}` : gemsDisp;
			let gg = `${g.name}: ${priceDisp}`;
			g.claims.forEach(c => {
				let cc = data.claimers.find(x => x.name == c);
				let ce = !cc ? "" : cc.sent ? cc.paid ? getEmoji().done : getEmoji().sent : cc.paid ? getEmoji().paid : "";
				if (ce.length > 0) ce += " ";
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
	
	let gems = data.params.gems ? ` (${Math.ceil((data.bundle.games[0].price / data.params.gemsPrice) * 1000)} ${getEmoji().gems})\n` : "\n";
	
	let pricing = data.bundle.type == 1
		? `${boldify('Pricing:')} ${formatCurr(bundlePrice, true)} / ${data.bundle.byob} = ${boldify(formatCurr(data.bundle.games[0].price, true), true)}${gems}`
		: `${boldify('Pricing:')} ~${Math.floor(data.bundle.ratio*100)}% of gg.deals price${data.bundle.games.some(g => g.priceOverride) ? " with " + boldify('modifications', true) : ""} (${formatCurr(p1, true)} / ${formatCurr(p2, true)}).\n`;
	
	let comments = data.params.comments ? data.params.commentBottom ? `\n\n${data.params.comments}` : `${data.params.comments}\n\n` : "";
	
	switch(data.params.misc.available) {
		case 0: a = ""; break;
		case 2: {
			if (data.bundle.type == 1 && !data.bundle.byobPlus && data.bundle.byob * data.bundle.count - taken == 0) { a = ""; break; }
			if (data.bundle.games.reduce((t, g) => t + (data.bundle.count - g.claims.length), 0) <= 0) {a = ""; break; }
		}
	}
	switch(data.params.misc.taken) {
		case 0: t = ""; break;
		case 2: {
			if (data.bundle.games.reduce((t, g) => t + g.claims.length, 0) <= 0) {t = ""; break; }
		}
		case 1: if (a != "") t = `\n${t}`; break;
	}
	switch(data.params.misc.pricing) {
		case 0: pricing = ""; break;
		case 1: if(a != "" || t != "") pricing = `\n${pricing}`; break;
	}
	switch(data.params.misc.payment) {
		case 0: payment = ""; break;
		case 1: if(a != "" || t != "" || pricing != "") payment = `\n${payment}`; break;
	}

	area.value = data.params.commentBottom
		? `${a}${t}${pricing}${payment}${comments}`
		: `${comments}${a}${t}${pricing}${payment}`;
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
		let keys = data.params.gems && data.params.keys && gems > data.params.keysPrice ? ` or ${Math.floor(gems / data.params.keysPrice)} ${getEmoji(true).tf2} + ${gems % data.params.keysPrice} ${getEmoji(true).gems}` : "";
		gems = data.params.gems ? data.params.paypal || data.params.revolut ? ` or ${gems} ${getEmoji(true).gems}` : `${gems} ${getEmoji(true).gems}` : "";
		
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
				let ce = !cc ? "" : cc.sent ? cc.paid ? getEmoji().done : getEmoji().sent : cc.paid ? getEmoji().paid : "";
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

function allowPick() {
	document.getElementById("pickBundleButton").disabled = false;
}

function fetchBundles() {
	document.getElementById("fetchBundlesButton").disabled = true;
	let req = new XMLHttpRequest();
	req.open("GET", "https://barter.vg/bundles/json/", true);
	req.onreadystatechange = () => {
		if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
			let resp = JSON.parse(req.response).bundles;
			let now = Date.now() / 1000;
			barterBundles = [];
			let bundleSelect = document.getElementById("bundleSelect");
			let count = bundleSelect.options.length - 1;
			for(i = count; i >= 0; i--)
				bundleSelect.remove(i);
			
			for (let key in resp) {
				let bun = resp[key];
				if (bun.meta.end > now && bun.meta.store !== 17 /*DIG*/) {
					let games = [];
					for (let gameKey in bun.games)
					games.push({
						id: bun.games[gameKey].id,
						item_id: bun.games[gameKey].item_id
					});
					barterBundles.push({
						id: key,
						start: bun.meta.start,
						store: bun.meta.store,
						storeName: bun.meta.storename,
						title: bun.meta.title,
						games: games
					});
				}
			}
			barterBundles.sort((a, b) => (a.start - b.start) * -1);
			barterBundles.forEach(bundle => {
				let bundleOption = document.createElement("option");
				bundleOption.value = bundle.id;
				bundleOption.innerHTML = `${bundle.storeName}: ${bundle.title}`;
				bundleSelect.appendChild(bundleOption);
			});
			document.getElementById("fetchBundlesButton").disabled = false;
		}
	};
	req.send();
}

function pickBundle() {
	document.getElementById("pickBundleButton").disabled = true;
	let pick = barterBundles.find(bundle => bundle.id == document.getElementById("bundleSelect").value);
	
	const getGame = (id) => {
		return new Promise((resolve, reject) => {
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == XMLHttpRequest.DONE && this.status == 200)
					resolve(xhttp.response);
			};
			xhttp.open("GET", `https://barter.vg/i/${id}/json/`, true);
			xhttp.send();
		});
	};
	
	let promises = [];
	pick.games.forEach(game => {
		promises.push(getGame(game.item_id));
	});
	
	Promise.all(promises).then((values) => {
		let games = values.map(v => JSON.parse(v)).toSorted((a, b) => a.title.localeCompare(b.title, undefined, {sensitivity: 'base'}));
		
		data.bundle.games = [];
		link.valid = false;
		games.forEach(g => data.bundle.games.push({
			name: g.title,
			value: 0,
			price: 0,
			priceOverride: false,
			claims: []
		}));
		reCalc();
		document.getElementById("pickBundleButton").disabled = false;
	});
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
		},
		version: data.version
	};
	let request = new XMLHttpRequest();
	request.open("POST", "/split/splits/split.php", true);
	request.setRequestHeader("Content-type", "application/json");
	request.onreadystatechange = () => {
		if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			link.url = `https://${document.location.host}/split?share=${request.response}`;
			link.valid = true;
			localStorage.setItem('link', JSON.stringify(link));
			popForm();
		}
	};
	request.send(JSON.stringify(contents));
}

function consumeShareLink(sharedData) {
	sharedData = migrate(sharedData);
	if (typeof sharedData?.params?.currency !== "string" || typeof sharedData.bundle.byob !== "number" || typeof sharedData.bundle.discount !== "number" || typeof sharedData.bundle.price !== "number" || typeof sharedData.bundle.type !== "number")
		throw new Error("Failed to check share link! (1)");
			
	sharedData.bundle.games.forEach(g => {
		if (typeof g.name !== "string" || typeof g.value !== "number" || typeof g.price !== "number" || typeof g.priceOverride !== "boolean")
			throw new Error("Failed to check share link! (2)");
	});
	
	switch(sharedData.params.currency) {
		case "0":
		case "1":
		case "2":
		case "3": data.params.currency = sharedData.params.currency; break;
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

function migrate(storedData) {
	let updatedData = {...storedData};
	switch(updatedData.version) {
		case undefined:
		case null:
		case 0: {
			switch(updatedData.params.currency) {
				case "EUR": updatedData.params.currency = "1"; break;
				case "GBP": updatedData.params.currency = "2"; break;
				case "USD":
				default: updatedData.params.currency = "0"; break;
			}
			updatedData.params.misc = {
				pricing: updatedData.params.hidePricing ? 0 : 1
			};
			delete updatedData.params.hidePricing;
			updatedData.version = 0;
		}
		case 1: updatedData.version = 1;
		case 2: updatedData.version = 2;
		case 3: {//Bug fix with default data
			if (updatedData.params.currency == 0)
				updatedData.params.currency = "0";
			updatedData.version = 3;
		}
		case 4: {//new Fanatical BYOB+ change
			updatedData.bundle.byobPlus = true;
			updatedData.version = 4;
		}
	}
	return updatedData;
}

let storedData = JSON.parse(localStorage.getItem('data'));
if (storedData) {
	storedData = migrate(storedData);
	data = {
		...data,
		params: {
			...data.params, 
			...storedData.params,
			currencyOther: {
				...data.params.currencyOther,
				...storedData.params.currencyOther
			},
			customEmoji: {
				...data.params.customEmoji,
				...storedData.params.customEmoji
			},
			misc: {
				...data.params.misc,
				...storedData.params.misc
			}
		},
		bundle: {...data.bundle, ...storedData.bundle},
		claimers: storedData.claimers,
		version: storedData.version
	};
}
let slink = JSON.parse(localStorage.getItem('link'));
if (slink) link = {
	url: slink?.url ?? link.url,
	valid: slink?.valid ?? link.valid
};

let urlParams = new URLSearchParams(window.location.search);
let shared = urlParams.get('share');
if (shared) {
	let url = `/split/splits/${shared}.json`;
	fetch(url).then(response => response.json()).then(out => {
		consumeShareLink(out);
		link = {
			url: window.location.href,
			valid: true
		};
		reCalc();
		window.history.replaceState(null, "", "/split");
	}).catch(err => {throw err;});
}

reCalc();
document.getElementById("lastMod").textContent = (new Date(Date.parse(document.lastModified))).toUTCString();