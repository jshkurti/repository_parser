
var assert = require("assert");
var shell  = require("shelljs");
var vizion = require("..");

/*
 To enable a sample test suite, remove the _disabled
 and fill in the strings.  One way to fetch these values is to
 create the sample directory, enter it as the directory,
 and then run this test suite (npm test).
 The test will return the expected value (a blank string),
 and the actual value, which can be then used as the string to
 test.
 */
var sample = {
	svn: {
		directory: "./test/fixtures/test_svn/",
		url: "https://github.com/mul1sh/vizionar_test",
		revision: "r3",
		comment: "dat commit though",
		branch: "vizionar_test",
		update_time: "2014-10-21T12:29:21.289Z"
	},
	hg: {
		directory: "./test/fixtures/test_hg/",
		url: "https://mulish@bitbucket.org/mulish/vizionar_test",
		revision: "a13c048",
		comment: "Initial commit with contributors",
		branch: "default",
		update_time: "2014-12-10T12:42:31.017Z"
	},
	git: {
		directory: "./test/fixtures/test_git/",
		url: "https://github.com/mul1sh/vizionar_test",
		revision: "bf06816ff30b4140226fe4a129b601439f389e21",
		comment: "Initial commit with contributors",
		branch: "master",
		update_time: "2014-12-10T12:42:31.017Z"
	}
};

describe("vizion.analyze()", function() {
  if (shell.which('svn')) {
	  it("Pulling from Subversion", function(done) {
      this.timeout(5000);
		  vizion.analyze({folder: sample.svn.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.url, sample.svn.url);
			  assert.equal(metadata.revision, sample.svn.revision);
			  assert.equal(metadata.comment, sample.svn.comment);
			  assert.equal(metadata.branch, sample.svn.branch);
			  if (err) return done(err);
			  done();
		  });
	  });
  }
  if (shell.which('hg')) {
	  it("Pulling from Mercurial", function(done) {
      this.timeout(5000);
		  vizion.analyze({folder: sample.hg.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.url, sample.hg.url);
			  assert.equal(metadata.revision, sample.hg.revision);
			  assert.equal(metadata.comment, sample.hg.comment);
			  assert.equal(metadata.branch, sample.hg.branch);
			  if (err) return done(err);
			  done();
		  });
	  });
  }
  if (shell.which('git')) {
	  it("Pulling from Git", function(done) {
      this.timeout(5000);
		  vizion.analyze({folder: sample.git.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.url, sample.git.url);
			  assert.equal(metadata.revision, sample.git.revision);
			  assert.equal(metadata.comment, sample.git.comment);
			  assert.equal(metadata.branch, sample.git.branch);
			  if (err) return done(err);
			  done();
		  });
	  });
  }

});

//is upto date
describe("vizion.isUpToDate()", function() {
  if (shell.which('svn')) {
	  it("Pulling from Subversion", function(done) {
      this.timeout(5000);
		  vizion.isUpToDate({folder: sample.svn.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.is_up_to_date, true);
			  assert.equal(metadata.new_revision, metadata.current_revision);
			  if (err) return done(err);			 
			  done();
		  });
	  });
  }
  if (shell.which('hg')) {
	  it("Pulling from Mercurial", function(done) {
      this.timeout(5000);
		   vizion.isUpToDate({folder: sample.hg.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.is_up_to_date, true);
			  assert.equal(metadata.new_revision, metadata.current_revision);	
			   if (err) return done(err);		 
			  done();
		  });
	  });
  }
  if (shell.which('git')) {
	  it("Pulling from Git", function(done) {
      this.timeout(5000);
		   vizion.isUpToDate({folder: sample.git.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.is_up_to_date, true);
			  assert.equal(metadata.new_revision, metadata.current_revision);
			   if (err) return done(err);			 
			  done();
		  });
	  });
  }

});



//update
describe("vizion.update()", function() {
  if (shell.which('svn')) {
	  it("Pulling from Subversion", function(done) {
      this.timeout(5000);
		  vizion.update({folder: sample.svn.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success, true);
			  assert.equal(metadata.new_revision, metadata.current_revision);	
			   if (err) return done(err);		 
			  done();
		  });
	  });
  }
  if (shell.which('hg')) {
	  it("Pulling from Mercurial", function(done) {
      this.timeout(5000);
		 vizion.update({folder: sample.svn.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success, true);
			  assert.equal(metadata.new_revision, metadata.current_revision);
			   if (err) return done(err);			 
			  done();
		  });
	  });
  }
  if (shell.which('git')) {
	  it("Pulling from Git", function(done) {
      this.timeout(5000);
		  vizion.update({folder: sample.svn.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success, true);
			  assert.equal(metadata.new_revision, metadata.current_revision);
			   if (err) return done(err);			 
			  done();
		  });
	  });
  }

});


//revert
describe("vizion.revertTo()", function() {
  if (shell.which('svn')) {
	  it("Pulling from Subversion", function(done) {
      this.timeout(5000);
		  vizion.revertTo({folder: sample.svn.directory, revision : "r2"}, 
		  	function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success , true);
			   if (err) return done(err);
			  done();
		  });
	  });
  }
  if (shell.which('hg')) {
	  it("Pulling from Mercurial", function(done) {
      this.timeout(5000);
		  vizion.revertTo({folder: sample.hg.directory, revision : "a13c9ywe2"}, 
		  	function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success , true);
			   if (err) return done(err);
			  done();
		  });
	  });
  }
  if (shell.which('git')) {
	  it("Pulling from Git", function(done) {
      this.timeout(5000);
		 vizion.revertTo({folder: sample.git.directory, revision : "bf06816ff30b4140226fe4a129b6"}, 
		  	function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success , true);
			   if (err) return done(err);
			  done();
		  });
	  });
  }

});

//previous
describe("vizion.prev()", function() {
  if (shell.which('svn')) {
	  it("Pulling from Subversion", function(done) {
      this.timeout(5000);
		  vizion.prev({folder: sample.svn.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success, true);
			  if (err) return done(err);
			  done();
		  });
	  });
  }
  if (shell.which('hg')) {
	  it("Pulling from Mercurial", function(done) {
      this.timeout(5000);
		   vizion.prev({folder: sample.hg.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success, true);
			  if (err) return done(err);
			  done();
		  });
	  });
  }
  if (shell.which('git')) {
	  it("Pulling from Git", function(done) {
      this.timeout(5000);
		  vizion.prev({folder: sample.git.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success, true);
			  if (err) return done(err);
			  done();
		  });
	  });
  }

});


//next
describe("vizion.next()", function() {
  if (shell.which('svn')) {
	  it("Pulling from Subversion", function(done) {
      this.timeout(5000);
		  vizion.next({folder: sample.svn.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success, true);
			  if (err) return done(err);
			  done();
		  });
	  });
  }
  if (shell.which('hg')) {
	  it("Pulling from Mercurial", function(done) {
      this.timeout(5000);
		 vizion.next({folder: sample.hg.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success, true);
			  if (err) return done(err);
			  done();
		  });
	  });
  }
  if (shell.which('git')) {
	  it("Pulling from Git", function(done) {
      this.timeout(5000);
		 vizion.next({folder: sample.git.directory}, function(err, metadata) {
			  assert.equal(err, null);
			  assert.equal(metadata.success, true);
			  if (err) return done(err);
			  done();
		  });
	  });
  }

});




