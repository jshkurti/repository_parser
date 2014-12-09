var fs = require('fs');
var async = require('async');
var exec = require('child_process').exec;


var halt = false;

function error(repoType, task, errorMsg, cb) {
	if (halt) return false;

	console.error("[Repo-Parser] An error occured while " + task + " in a " + repoType + " repository: " + errorMsg);
	halt = true;
  return cb("[Repo-Parser] An error occured while " + task + " in a " + repoType + " repository: " + errorMsg);
}

function checkReturn(dataArray, cb) {
	if (halt) {
		return false;
	}
	if (Object.keys(dataArray).length > 6) {
    Object.keys(dataArray).forEach(function(key) {
      if (typeof(dataArray[key]) === 'string') {
        dataArray[key] = dataArray[key].replace(/\n/g, '');
      }
    });
		cb(null, dataArray);
	}
};




var hg = {};


hg.parse = function(folder, cb) {

    var data = {};

  data.type = 'mercurial';
  data.commit_history = []; // temporary

	exec("cd '"+folder+"';LC_ALL=en_US.UTF-8 hg paths default", function(err, stdout, stderr) {
		if(err !== null) {
			error("mercurial", "fetching path", stderr, cb);
		}
		else {
			data.url = stdout;
			checkReturn(data, cb);
		}
	});
	exec("cd '"+folder+"';LC_ALL=en_US.UTF-8 hg log --limit 1", function(err, stdout, stderr) {
		if(err !== null) {
			error("mercurial", "fetching log", stderr, cb);
		}
		else {
			var changeset = stdout.match(/^changeset:\s+([^\n]+)$/m);
			//date = stdout.match(/^date:\s+:([^\n]+)$/m);
			var summary = stdout.match(/^summary:\s+([^\n]+)$/m);
			data.revision = changeset[1];
			data.comment = summary[1];
			//data.update_time = date;
			checkReturn(data, cb);
		}
	});
	exec("cd '"+folder+"';LC_ALL=en_US.UTF-8 hg branch", function(err, stdout, stderr) {
		if(err !== null) {
			error("mercurial", "fetching branch", stderr, cb);
		}
		else {
			data.branch = stdout;
			checkReturn(data, cb);
		}
	});
	fs.stat(folder+".hg", function(err, stats) {
		if(err !== null) {
			error("mercurial", "fetching stats", "no error available", cb);
		}
		else {
			data.update_time = stats.mtime;
			checkReturn(data, cb);
		}
	});
};


hg.isUpdated = function(folder, cb) {
  hg.parse(folder, function(err, data) {
    if (err !== null)
      return cb(err);
    exec("cd '"+folder+"';LC_ALL=en_US.UTF-8 hg update >> /dev/null 2>&1; hg log "+data.remote
         +"/"+data.branch+" --limit 1", function(err, stdout, stderr) {
           var res = {};

           if(err !== null)
             return cb(err);
           if (stdout.substring(0, 40) === data.revision.substring(0, 40))
             res.is_up_to_date = true;
           else
             res.is_up_to_date = false;
           res.new_revision = stdout.substring(0, 40);
           res.current_revision = data.revision.substring(0, 40);
           return cb(null, res);
         });
  });
};

hg.revert = function(args, cb) {
  exec("cd '"+args.folder+"';LC_ALL=en_US.UTF-8 hg revert -C "+args.revision,
  function(err, stdout, stderr) {
    if (err !== null || stderr.substring(0, 6) === 'fatal:')
      return cb(null, {success: false});
    return cb(null, {success: true});
  });
};


hg.update = function(folder, cb) {
  hg.isUpdated(folder, function(err, data) {
    var res = {};
    if (err !== null)
      return cb(err);
    if (data.is_up_to_date === true) {
      res.success = false;
      res.current_revision = data.new_revision;
      return cb(null, res);
    }
    else {
      hg.revert({folder: folder, revision: data.new_revision},
      function (err, dt) {
        if (err !== null)
          return cb(err);
        res.success = dt.success;
        res.current_revision = (dt.success) ? data.new_revision : data.current_revision;
        return cb(null, res);
      });
    }
  });
};


hg.prev = function(folder, cb) {
  hg.parse(folder, function(err, data) {
    if (err !== null)
      return cb(err);
    var res = {};
    if (data.prev_rev !== null) {
      git.revert({folder: folder, revision: data.prev_rev}, function(err, meta){
        if (err !== null)
          return cb(err);
        res.success = meta.success;
        res.current_revision = (res.success) ? data.prev_rev : data.revision;
        return cb(null, res);
      });
    }
    else {
      res.success = false;
      res.current_revision = data.revision;
      return cb(null, res);
    }
  });
};

hg.next = function(folder, cb) {
  hg.parse(folder, function(err, data) {
    if (err !== null)
      return cb(err);
    var res = {};
    if (data.next_rev !== null) {
      hg.revert({folder: folder, revision: data.next_rev}, function(err, meta){
        if (err !== null)
          return cb(err);
        res.success = meta.success;
        res.current_revision = (res.success) ? data.next_rev : data.revision;
        return cb(null, res);
      });
    }
    else {
      res.success = false;
      res.current_revision = data.revision;
      return cb(null, res);
    }
  });
};

module.exports = hg;




