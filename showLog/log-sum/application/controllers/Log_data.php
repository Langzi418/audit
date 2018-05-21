<?php

class Log_data extends CI_Controller {
	public function __construct()
	{
		parent::__construct();
		$this->load->helper('mongodb');
		header("Access-Control-Allow-Origin:*");
		header("Access-Control-Allow-Methods:GET,POST");
	}


	public function get_all_log()
	{
		$res = get_all_log();
		$this->output->set_content_type('application/json')->set_output(json_encode($res));
	}

	public function get_log_by_ip()
	{
		$ip = $this->input->get('ip', TRUE);
		$res = get_log_by_ip($ip);
		$this->output->set_content_type('application/json')->set_output(json_encode($res));
	}

	public function get_log_by_agent()
	{
		$agent = $this->input->get('agent', TRUE);
		$res = get_log_by_agent($agent);
		$this->output->set_content_type('application/json')->set_output(json_encode($res));
	}

	public function get_log_by_time()
	{
		$time = $this->input->get('time', TRUE);
		$res = get_log_by_time($time);
		$this->output->set_content_type('application/json')->set_output(json_encode($res));
	}
}