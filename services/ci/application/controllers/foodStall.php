<?php
class FoodStall extends BM_Controller {
    public function getCampus() {
        $res = $this->sp('sp_getCampus', array(), 'LOCALDB')->result();

        $data = array(
            'json' => $res,
        );

        return $this->load->view('json_view', $data);
    }

    public function getPayment() {
        $res = $this->sp('sp_getPayment', array(), 'LOCALDB')->result();

        $data = array(
            'json' => $res,
        );

        return $this->load->view('json_view', $data);
    }

    public function getFoodStall(){

        $CampusID = $_GET["CampusID"];

        $res = $this->sp('sp_getFoodStall', array(
            "CampusID" => $CampusID
        ), 'LOCALDB')->result();

        $data = array(
            'json' => $res,
        );
        return $this->load->view('json_view', $data);
    }

    public function insertFoodStall() {
        $foodStall = json_decode($_POST['foodStall']);

        $res = $this->sp('sp_insertFoodStall', $foodStall, 'LOCALDB')->result();

        $data = array(
            'json' => $res,
        );

        return $this->load->view('json_view', $data);
    }

    public function updateFoodStall() {
        $foodStall = json_decode($_POST['foodStall']);

        $res = $this->sp('sp_updateFoodStall', $foodStall, 'LOCALDB')->result();

        $data = array(
            'json' => $res,
        );

        return $this->load->view('json_view', $data);
    }

    public function deleteFoodStall() {
        $FoodStallID = $_POST["FoodStallID"];

        $res = $this->sp('sp_deleteFoodStall', array(
            'FoodStallID' => $FoodStallID
        ), 'LOCALDB')->result();

        $data = array(
            'json' => $res,
        );

        return $this->load->view('json_view', $data);
    }

    public function getFoodStallDetail() {
        $FoodStallID = $_GET["FoodStallID"];

        $res = $this->sp('sp_getFoodStallDetail', array(
            'FoodStallID' => $FoodStallID
        ), 'LOCALDB')->result();

        $data = array(
            'json' => $res,
        );

        return $this->load->view('json_view', $data);
    }
}
?>