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
		// case "Ans":
		// 	// reinstate ans if directly after "=", otherwise append to output
		// 	res = toClear ? ans : res + ans;
		// 	toClear = false;
		// 	break;
		case "=":
			res = evaluate(res);
			break;
		default:
			throw new Error("wrong button value: " + val);
		}
		$display.val(res);
	}

	function evaluate(str) {
		// don't eval and reassign ans if empty
		if(str === '') return '';
		let res;

		// if doesn't eval, don't change output
		try {
			res = eval(str);
		} catch (e) {
			console.log("Error", e);
			return str;
		}
		toClear = true;
		$display.parent().addClass("evalled");
		if(String(res).length > 14) res = res.toExponential(4);
		return ans = res;
	}

	$('.buttonPanel').on('click', 'button', function () {
		console.log("button", this.value, "clicked");
		console.log("toClear", toClear);
		console.log("Answer", ans);
		$display.parent().removeClass("evalled");


		if(transformativeValues.includes(this.value)) {

			transformOutput(this.value);
		} else {
			if(toClear) $display.val('');
			// const newVal = toClear ? this.value : $display.val() + this.value;
			const newVal = $display.val() + (this.value === "Ans" ? ans : this.value);

			// don't do any checks for "NaN", let it fail and be caught

			// add new value only if eval is possible or will be possible later
			try {
				console.log("trying", newVal.endsWith("Infinity") ? newVal : newVal+"0");
				// don't append "0" to "Infinity" => always throws
				eval(newVal.endsWith("Infinity") ? newVal : newVal+"0");
			} catch (e) {
				console.log("Error", e);
				return;
			}

			toClear = false;

			$display.val(newVal);
		}

		$display[0].scrollLeft = $display[0].scrollWidth;
	});
});