//#region packages/icu-messageformat-parser/types.ts
let TYPE = /* @__PURE__ */ function(TYPE) {
	/**
	* Raw text
	*/
	TYPE[TYPE["literal"] = 0] = "literal";
	/**
	* Variable w/o any format, e.g `var` in `this is a {var}`
	*/
	TYPE[TYPE["argument"] = 1] = "argument";
	/**
	* Variable w/ number format
	*/
	TYPE[TYPE["number"] = 2] = "number";
	/**
	* Variable w/ date format
	*/
	TYPE[TYPE["date"] = 3] = "date";
	/**
	* Variable w/ time format
	*/
	TYPE[TYPE["time"] = 4] = "time";
	/**
	* Variable w/ select format
	*/
	TYPE[TYPE["select"] = 5] = "select";
	/**
	* Variable w/ plural format
	*/
	TYPE[TYPE["plural"] = 6] = "plural";
	/**
	* Only possible within plural argument.
	* This is the `#` symbol that will be substituted with the count.
	*/
	TYPE[TYPE["pound"] = 7] = "pound";
	/**
	* XML-like tag
	*/
	TYPE[TYPE["tag"] = 8] = "tag";
	return TYPE;
}({});
/**
* Type Guards
*/
function isLiteralElement(el) {
	return el.type === 0;
}
function isArgumentElement(el) {
	return el.type === 1;
}
function isNumberElement(el) {
	return el.type === 2;
}
function isDateElement(el) {
	return el.type === 3;
}
function isTimeElement(el) {
	return el.type === 4;
}
function isSelectElement(el) {
	return el.type === 5;
}
function isPluralElement(el) {
	return el.type === 6;
}
function isPoundElement(el) {
	return el.type === 7;
}
function isTagElement(el) {
	return el.type === 8;
}
//#endregion
//#region packages/icu-messageformat-parser/printer.ts
function printAST(ast) {
	return doPrintAST(ast, false);
}
function doPrintAST(ast, isInPlural) {
	return ast.map((el, i) => {
		if (isLiteralElement(el)) return printLiteralElement(el, isInPlural, i === 0, i === ast.length - 1);
		if (isArgumentElement(el)) return printArgumentElement(el);
		if (isDateElement(el) || isTimeElement(el) || isNumberElement(el)) return printSimpleFormatElement(el);
		if (isPluralElement(el)) return printPluralElement(el);
		if (isSelectElement(el)) return printSelectElement(el);
		if (isPoundElement(el)) return "#";
		if (isTagElement(el)) return printTagElement(el);
	}).join("");
}
function printTagElement(el) {
	return `<${el.value}>${printAST(el.children)}</${el.value}>`;
}
function quoteSyntaxToken(token) {
	return `'${token.split("'").join("''")}'`;
}
function isAlpha(ch) {
	if (!ch) return false;
	const code = ch.charCodeAt(0);
	return code >= 65 && code <= 90 || code >= 97 && code <= 122;
}
function isTagSyntaxStart(message, index) {
	if (message[index] !== "<") return false;
	const next = message[index + 1];
	return next === "/" || isAlpha(next);
}
function findTagSyntaxEnd(message, index) {
	const closingIndex = message.indexOf(">", index + 1);
	return closingIndex === -1 ? message.length : closingIndex + 1;
}
function findBraceSyntaxEnd(message, index) {
	const closingIndex = message.indexOf("}", index + 1);
	return closingIndex === -1 ? index + 1 : closingIndex + 1;
}
function printEscapedMessage(message, isInPlural = false) {
	let result = "";
	let literalStart = 0;
	function quoteToken(start, end) {
		result += message.slice(literalStart, start);
		result += quoteSyntaxToken(message.slice(start, end));
		literalStart = end;
	}
	for (let i = 0; i < message.length; i++) {
		const ch = message[i];
		if (ch === "{") {
			const end = findBraceSyntaxEnd(message, i);
			quoteToken(i, end);
			i = end - 1;
		} else if (ch === "}") quoteToken(i, i + 1);
		else if (isTagSyntaxStart(message, i)) {
			const end = findTagSyntaxEnd(message, i);
			quoteToken(i, end);
			i = end - 1;
		} else if (isInPlural && ch === "#") quoteToken(i, i + 1);
	}
	return result + message.slice(literalStart);
}
function printLiteralElement({ value }, isInPlural, isFirstEl, isLastEl) {
	let escaped = value;
	if (!isFirstEl && escaped[0] === `'`) escaped = `''${escaped.slice(1)}`;
	if (!isLastEl && escaped[escaped.length - 1] === `'`) escaped = `${escaped.slice(0, escaped.length - 1)}''`;
	return printEscapedMessage(escaped, isInPlural);
}
function printArgumentElement({ value }) {
	return `{${value}}`;
}
function printSimpleFormatElement(el) {
	return `{${el.value}, ${TYPE[el.type]}${el.style ? `, ${printArgumentStyle(el.style)}` : ""}}`;
}
function printNumberSkeletonToken(token) {
	const { stem, options } = token;
	return options.length === 0 ? stem : `${stem}${options.map((o) => `/${o}`).join("")}`;
}
function printArgumentStyle(style) {
	if (typeof style === "string") return printEscapedMessage(style);
	else if (style.type === 1) return `::${printDateTimeSkeleton(style)}`;
	else return `::${style.tokens.map(printNumberSkeletonToken).join(" ")}`;
}
function printDateTimeSkeleton(style) {
	return style.pattern;
}
function printSelectElement(el) {
	return `{${[
		el.value,
		"select",
		Object.keys(el.options).map((id) => `${id}{${doPrintAST(el.options[id].value, false)}}`).join(" ")
	].join(",")}}`;
}
function printPluralElement(el) {
	const type = el.pluralType === "cardinal" ? "plural" : "selectordinal";
	return `{${[
		el.value,
		type,
		[el.offset ? `offset:${el.offset}` : "", ...Object.keys(el.options).map((id) => `${id}{${doPrintAST(el.options[id].value, true)}}`)].filter(Boolean).join(" ")
	].join(",")}}`;
}
//#endregion
export { doPrintAST, printAST, printDateTimeSkeleton };

//# sourceMappingURL=printer.js.map