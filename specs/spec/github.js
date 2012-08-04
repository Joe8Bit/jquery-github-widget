describe("Github Widget", function() {

	// Instantiate our default widget
	$(document).ready(function(){
		$("#insert-here").github();
	});

	describe("should render", function() {

		it("the container view", function() {
			expect($("#ghw-github")).toExist();
		});

		it("the header when the option is set to default", function() {
			expect($("#ghw-header")).toExist();
		});

		it("the extended user info when the option is set to default", function() {
			expect($("#ghw-extended-user-info")).toExist();
		});

		it("the user's total number of repos", function() {
			expect($("#ghw-header-total-repos")).toExist();
		});

		it("the user's followers when the option is set to default", function() {
			expect($("#ghw-current-followers")).toExist();
		});

		it("the user's profile photo if one is set on Github", function() {
			expect($("img[alt='Avatar']")).toExist();
		});

		it("the the default 10 repos (if they're available from the user)", function() {
			expect($(".ghw-repo").length).toEqual(10);
		});

		it("the number of forks in a repo", function() {
			expect($(".ghw-forks")).toExist();
		});

		it("the number of watchers on a repo", function() {
			expect($(".ghw-watchers")).toExist();
		});

		it("the number of issues open on a repo", function() {
			expect($(".ghw-issues")).toExist();
		});

		it("a repo title", function() {
			expect($(".ghw-title a").text().length).toBeGreaterThan(0);
		});

		it("a link to a Github repo from the title", function() {
			expect($(".ghw-title a").attr("href").length).toBeGreaterThan(0);
		});

		it("a repos description", function() {
			expect($(".ghw-title a").attr("data-description").length).toBeGreaterThan(0);
		});

	});

	describe("should react to user interaction", function() {

		it("by displaying extended user information when hovering on their avatar", function() {
			$('#ghw-user a').trigger('mouseover');
			expect($("#ghw-extended-user-info")).toBeVisible();
		});

		it("by displaying a repo description when hovering on the repo title", function() {
			$('.ghw-title a').trigger('mouseover');
			expect($(".ghw-github-tooltip-content")).toBeVisible();
		});

		it("by displaying extened info about a repos forks when hovering", function() {
			$('.ghw-forks:first-child').trigger('mouseover');
			expect($(".ghw-forks:first-child .ghw-github-tooltip-content")).toBeVisible();
			expect($(".ghw-forks:first-child .ghw-github-tooltip-content")).not.toBeEmpty();
		});

	});

	describe("should load the correct information from Github for the default user", function() {

		it("by displaying the correct user name", function() {
			expect($("#ghw-github-user-data h2 a").text()).toEqual("JoePettersson");
		});

		it("by displaying the correct number of followers", function() {
			expect(parseFloat($("#ghw-current-followers").text())).toBeGreaterThan(1);
		});

		it("by displaying one of the correct repos", function() {
			expect($(".ghw-title:first-child a").text()).toContain("A-simple-jQuery-powered-image-slider");
		});

		it("by containging the correct descrption for one of the repos", function() {
			expect($(".ghw-title:first-child a").attr("data-description")).toContain("<p>A-simple-jQuery-powered-image-slider</p>A simple but elegant image slider based on a design by Orman Clark");
		});

	});

});