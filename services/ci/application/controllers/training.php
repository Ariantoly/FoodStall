<?php
class Training extends BM_Controller {

    public function test(){
        $res = $this->sp('sp_getAssignments', array(), 'LOCALDB')->result();

        $data = array(
            'json' => $res,
        );

        return $this->load->view('json_view', $data);
    }



}