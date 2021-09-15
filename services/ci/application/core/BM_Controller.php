<?php 

class BM_Controller extends CI_Controller 
{	
	public function sp($sp_name, $array = array(), $db = 'default')
	{
		$DBS = $this->load->database($db, TRUE);
		
		$param_name = array();
		$param_list = array();
		foreach($array as $key => $val)
		{
			$param_name[] = '@' . $key . '=?';
			$param_list[] = $val;
		}
		
		$sp_name .= ' '. implode(', ', $param_name);
		
		$Data = $DBS->query($sp_name, $param_list);
		$this->db->close();
		return $Data;
	}
}

/* End of file BM_Controller.php */