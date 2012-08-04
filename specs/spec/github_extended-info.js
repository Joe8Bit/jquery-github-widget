describe("Github Widget", function() {

	// Instantiate our default widget
	$(document).ready(function(){
		$("#insert-here").github({
			show_extended_info: false
		});
	});

	describe("should not display", function() {

		it("extended user info when the option is set to false", function() {
			expect($("#ghw-extended-user-info")).not.toExist();
		});

	});

});