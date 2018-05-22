<?php

define('DB_NAME','test');
define('COLLECTION_NAME','ppt');
define("DB_CONNECTION","mongodb://localhost:27017");

function obj2array($log_data)
{
	$res = array();
	foreach ($log_data as $item) {
		$res[] = $item;
	}
	return $res;
}

function get_all_log()
{
	$manager = new MongoDB\Driver\Manager(DB_CONNECTION);
	$query = new MongoDB\Driver\Query([], []);
	$cursor = $manager->executeQuery(DB_NAME.".".COLLECTION_NAME, $query);
	$res = obj2array($cursor);
	return $res;
}

function get_log_by_ip()
{
	$manager = new MongoDB\Driver\Manager(DB_CONNECTION);
	$cmd = new MongoDB\Driver\Command([
		'aggregate' => COLLECTION_NAME,
		'pipeline' => [
			['$group' => ['_id' => '$remote_addr','count' => ['$sum' => 1]]
		]]
	]);
	$rows = $manager->executeCommand(DB_NAME, $cmd);
	$res = obj2array($rows);
	return $res;
}

function get_log_by_agent()
{
	$manager = new MongoDB\Driver\Manager(DB_CONNECTION);
	$cmd = new MongoDB\Driver\Command([
		'aggregate' => COLLECTION_NAME,
		'pipeline' => [
			['$group' => ['_id' => '$http_user_agent','count' => ['$sum' => 1]]
		]]
	]);
	$rows = $manager->executeCommand(DB_NAME, $cmd);
	$res = obj2array($rows);
	return $res;
}

function get_log_by_time()
{
	$manager = new MongoDB\Driver\Manager(DB_CONNECTION);
	$cmd = new MongoDB\Driver\Command([
		'aggregate' => COLLECTION_NAME,
		'pipeline' => [
			['$group' => ['_id' => '$time_local','count' => ['$sum' => 1]]
		]]
	]);
	$rows = $manager->executeCommand(DB_NAME, $cmd);
	$res = obj2array($rows);
	return $res;
}