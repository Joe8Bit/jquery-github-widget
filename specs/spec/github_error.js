describe("Github Widget", function() {

	// Instantiate our default widget
	$(document).ready(function(){
		$("#insert-here").github({
			user: "alsjq9eq"
		});
	});

	describe("should behave in a predictable way when errors happen", function() {

		it("by displaying a message to the user when a bad user is requested", function() {
			expect($("#ghw-github-user-data h2 a").text()).toContain("User not found");
		});

	});

});