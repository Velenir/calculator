$(document).ready(function() {
	const $display = $('#display');
	let ans = "", toClear = false;

	const transformativeValues = ["AC", "CE", "="];
	function transformOutput(val) {
		let res = $display.val();
		switch (val) {
		case "AC":
			// clear output
			res = "";
			break;
		case "CE":
			// remove Infinity wholesale
			if(res.endsWith("Infinity")) res = res.slice(0, -"Infinity".length);
			else res = res.slice(0, -1);
			// accept resulting output as is, even if directly after "="
			toClear = false;
			break;
		case "=":
			res = evaluate(res);
			break;
		default:
			throw new Error("wrong button value: " + val);
		}
		$display.val(res);
		// scrolls to right edge;
		$display[0].scrollLeft = $display[0].scrollWidth;
		// shorten and use scientific notation if answer alone still makes output scroll
		if($display[0].scrollLeft > 0) {
			res = res.toExponential(4);
			$display.val(ans = res);
		}
	}

	function evaluate(str) {
		// don't eval and reassign ans if empty
		if(str === '') return '';
		let res;

		// if doesn't eval, don't change output
		try {
			res = eval(str);
		} catch (e) {
			console.log("Error", e.message);
			return str;
		}
		toClear = true;
		$display.parent().addClass("evalled");

		// // shorten and use scientific notation if answer alone makes output scroll
		// if($display[0].scrollLeft > 0) {
		// 	res = res.toExponential(4);
		// }
		return ans = res;
	}

	$('.buttonPanel').on('click', 'button', function () {

		$display.parent().removeClass("evalled");

		if(transformativeValues.includes(this.value)) {

			transformOutput(this.value);
		} else {
			if(toClear && !"+-*/%".includes(this.value)) $display.val('');
			// const newVal = toClear ? this.value : $display.val() + this.value;
			const newVal = $display.val() + (this.value === "Ans" ? ans : this.value);

			// don't do any checks for "NaN", let it fail and be caught

			// add new value only if eval is possible or will be possible later
			try {
				// "9//\d*" always evals to 9
				if(newVal.endsWith("//")) throw new SyntaxError("Double divider //");
				// don't append "0" to "Infinity" => always throws
				eval(newVal.endsWith("Infinity") ? newVal : newVal+"0");
			} catch (e) {
				console.log("Error", e.message);
				return;
			}

			toClear = false;

			$display.val(newVal);
		}

		// move caret to the right end
		$display[0].scrollLeft = $display[0].scrollWidth;
	});
});
