$(document).ready(function() {
	const $display = $('#display');
	let ans = "", toClear = false;

	const transformativeValues = ["AC", "CE", "Ans", "="];
	function transformOutput(val) {
		let res = $display.val();
		switch (val) {
		case "AC":
			res = "";
			break;
		case "CE":
			res = res.slice(0, -1);
			break;
		case "Ans":
			res += ans;
			break;
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
		if(str === '') return;
		toClear = true;
		return ans = eval(str);
	}

	$('.buttonPanel').on('click', 'button', function (e) {
		console.log("button", this, "clicked");



		if(transformativeValues.includes(this.value)) {
			transformOutput(this.value);
		} else {
			const newVal = toClear ? this.value : $display.val() + this.value;


			// add new value only if eval is possible or will be possible later
			try {
				eval(newVal+"0");
			} catch (e) {
				console.log("Error", e);
				// toClear = false;
				return;
			}

			toClear = false;

			// if(toClear) {
			// 	$display.val('');
			// 	toClear = false;
			// }

			$display.val(newVal);
		}
	});
});
