describe("Github Widget", function() {

	// Instantiate our default widget
	$(document).ready(function(){
		$("#insert-here").github({
			show_follows: false
		});
	});

	describe("should not display", function() {

		it("a users followers when the option is set to false", function() {
			expect($("#ghw-current-followers")).not.toExist();
		});

	});

});