<?php
class Landingpage extends CI_Controller {

        public function __construct()
        {
                parent::__construct();
                $this->load->helper('url_helper');
        }
        
        public function index()
        {
            $data['title'] = 'Welcome To Mapbox';

            $this->load->view('login/home', $data);
        }
}