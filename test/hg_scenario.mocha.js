'use strict';


var should = require('should');
var shell  = require('shelljs');
var vizion = require('..');
var p      = require('path');

if (shell.which('hg') !== null) {
  describe('Mercurial scenario', function() {
    var repo_pwd = '';
    var tmp_meta = {};

    before(function(done) {
      this.timeout(10000);
      shell.cd('test/fixtures/test_hg');

      if (shell.ls('vizionar_test').length == 0)
        shell.exec('hg clone https://mulish@bitbucket.org/mulish/vizionar_test');

      repo_pwd = p.join(shell.pwd(), 'vizionar_test');
      done();
    });

    after(function(done) {
      shell.rm('-rf', 'vizionar_test');
      done();
    });

    it('should update to latest', function(done) {
      this.timeout(10000);
      vizion.update({
        folder : repo_pwd
      }, function(err, meta) {
        should(err).not.exist;
        should(meta.success).be.false;
        done();
      });
    });

    it('should analyze versioned folder', function(done) {
      this.timeout(10000);
      vizion.analyze({
        folder: repo_pwd
      }, function(err, meta) {
        should(err).not.exist;

        meta.type.should.equal('git');
        meta.branch.should.equal('master');
        should.exist(meta.comment);
        should.exist(meta.url);
        should.exist(meta.revision);

        should(meta.next_rev).be.null;
        should(meta.prev_rev).not.be.null;

        tmp_meta = meta;

        done();
      });
    });

    it('should checkout older version', function(done) {
      this.timeout(10000);
      vizion.revertTo({
        folder     : repo_pwd,
        revision   : tmp_meta.prev_rev
      }, function(err, meta) {
        should(err).not.exist;

        done();
      });
    });

    it('should has next and prev', function(done) {
      this.timeout(10000);
      vizion.analyze({
        folder: repo_pwd
      }, function(err, meta) {
        should(err).not.exist;

        should(meta.next_rev).not.be.null;
        should(meta.prev_rev).not.be.null;

        tmp_meta = meta;

        done();
      });
    });

    it('should see that its not on HEAD', function(done) {
      this.timeout(10000);

      vizion.isUpToDate({
        folder : repo_pwd
      }, function(err, meta) {

        should(err).not.exist;
        meta.is_up_to_date.should.be.false;

        done();
      });
    });

    it('should recursively downgrade to first commit', function(done) {
      this.timeout(20000);
      var callback = function(err, meta) {
        should(err).not.exist;
        should(meta).be.ok;
        if (meta.success === true) {
          vizion.prev({folder: repo_pwd}, callback);
        }
        else {
          should(meta.success).be.false;
          vizion.analyze({folder: repo_pwd}, function(err, meta) {
            should(err).not.exist;
            should(meta.prev_rev).be.null;
            done();
          });
        }
      }
      vizion.prev({folder : repo_pwd}, callback);
    });

    it('should recursively upgrade to most recent commit', function(done) {
      this.timeout(20000);
      var callback = function(err, meta) {
        should(err).not.exist;
        should(meta).be.ok;
        if (meta.success === true) {
          vizion.next({folder: repo_pwd}, callback);
        }
        else {
          should(meta.success).be.false;
          vizion.analyze({folder: repo_pwd}, function(err, meta) {
            should(err).not.exist;
            should(meta.next_rev).be.null;
            done();
          });
        }
      }
      vizion.next({folder : repo_pwd}, callback);
    });

  });
}
