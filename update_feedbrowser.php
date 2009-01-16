#!/usr/bin/php
<?php
	// this script is probably run not from your httpd-user, so cache
	// directory defined in config.php won't be accessible
	define('MAGPIE_CACHE_DIR', '/var/tmp/magpie-ttrss-cache-cli');
	define('SIMPLEPIE_CACHE_DIR',	'/var/tmp/simplepie-ttrss-cache-cli');
	define('DEFAULT_ERROR_LEVEL', E_ERROR | E_WARNING | E_PARSE);
	define('DISABLE_SESSIONS', true);

	error_reporting(DEFAULT_ERROR_LEVEL);

	require_once "sanity_check.php";
	require_once "config.php";
	require_once "db.php";
	require_once "db-prefs.php";
	require_once "functions.php";

	$lock_filename = "update_feedbrowser.lock";

	$lock_handle = make_lockfile($lock_filename);

		// Try to lock a file in order to avoid concurrent update.
	if (!$lock_handle) {
		die("error: Can't create lockfile ($lock_filename). ".
			"Maybe another process is already running.\n");
	}

	// Create a database connection.
	$link = db_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);	

	if (!$link) {
		if (DB_TYPE == "mysql") {
			print mysql_error();
		}
		// PG seems to display its own errors just fine by default.		
		return;
	}

	init_connection($link);

	$count = update_feedbrowser_cache($link);

	print "Finished, $count feeds processed.\n";

	db_close($link);

	unlink(LOCK_DIRECTORY . "/$lock_filename");

?>
