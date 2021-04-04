<?php
require('fpdf/fpdf.php');
require_once('configTP.php');

class PDF extends FPDF
{
// Page header
function Header()
{
    // Logo
   // $this->Image('logo.png',10,6,30);
    // Arial bold 15
    $this->SetFont('Arial','B',15);
    // Move to the right
    $this->Cell(80);
    // Title
    $this->Cell(30,10,utf8_decode('Informação'),1,0,'C');
    // Line break
    $this->Ln(20);
}

// Page footer
function Footer()
{
    // Position at 1.5 cm from bottom
    $this->SetY(-15);
    // Arial italic 8
    $this->SetFont('Arial','I',8);
    // Page number
    $this->Cell(0,10,utf8_decode('Página').$this->PageNo().'/{nb}',0,0,'C');
}

// Colored table
function FancyTable($header, $data)
{
    // Colors, line width and bold font
    $this->SetFillColor(204,204,204);
    $this->SetTextColor(0);
    $this->SetDrawColor(0,0,0);
    $this->SetLineWidth(.3);
    $this->SetFont('','B');
    // Header
    $w = array(7, 70, 15, 15, 15, 15, 30, 10, 15);
    for($i=0;$i<count($header);$i++)
        $this->Cell($w[$i],7,$header[$i],1,0,'C',true);
    $this->Ln();
    // Color and font restoration
    $this->SetFillColor(224,235,255);
    $this->SetTextColor(0);
    $this->SetFont('');
    // Data
    $fill = false;
    foreach($data as $row)
    {
        $this->Cell($w[0],6,$row[0],'LR',0,'L',$fill);
        $this->Cell($w[1],6,$row[1],'LR',0,'L',$fill);
        $this->Cell($w[2],6,$row[2],'LR',0,'C',$fill);
        $this->Cell($w[3],6,number_format($row[3]),'LR',0,'C',$fill);
		$this->Cell($w[4],6,number_format($row[4]),'LR',0,'C',$fill);
		$this->Cell($w[5],6,number_format($row[5]),'LR',0,'C',$fill);
		$this->Cell($w[6],6,number_format($row[6]),'LR',0,'C',$fill);
		$this->Cell($w[7],6,number_format($row[7]),'LR',0,'C',$fill);
		$this->Cell($w[8],6,number_format($row[8]),'LR',0,'C',$fill);
        $this->Ln();
        $fill = !$fill;
    }
    // Closing line
    $this->Cell(array_sum($w),0,'','T');
}
}
// Instanciation of inherited class
$newarray = array();
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Times','',12);
$data = mostra('professor1',$pdf,$newarray);
$header = array('N.', 'Nome', 'Turma', 'N.V.A.','Tempo','N.T.R.','Sucesso (em %)','TPC','Exames');
$pdf->FancyTable($header,$data);
$pdf->Output();


function mostra($rcodpofessor,$pdf,$newarray)
{
   GLOBAL $db;
   $table="alunos";
   $table2="sessao";
   $table3="exames";
   $query = mysql_query("SELECT user,numero,nome,turma FROM $table WHERE (codprofessor ='$rcodpofessor') ORDER BY numero ASC");
   if(mysql_num_rows($query)<1)
   {
      return "erro=0";
   } else {
      $i=0;
      while ($row = mysql_fetch_array($query)) {
		     $queryy = mysql_query("SELECT tempo,ntr,ntrc FROM $table2 WHERE (idaluno ='$row[user]')");
			 $querye = mysql_query("SELECT examenumber,nota FROM $table3 WHERE (user ='$row[user]')");
			 $exame1 = 0;$notam1 = 0;
			 while ($rowse = mysql_fetch_array($querye)) {
			 	$exame1 = $exame1 + 1; $notam1=$notam1 + $rowse['nota'];
			 }
			 $nentradas=mysql_num_rows($queryy);
			 $tempom = 0;
			 $ntrm = 0;
			 $ntrcm = 0;
			 while ($rows = mysql_fetch_array($queryy)) {
			    $a = $rows['tempo'];
			 	$tempom = $tempom + $a;
				$b = $rows['ntr'];
				$ntrm = $ntrm + $b;
				$c = $rows['ntrc'];
				$ntrcm = $ntrcm + $c;
			}
			if ($nentradas!=0) {
				$tempom=$tempom/$nentradas;
				//$ntrm = $ntrm/$nentradas;
			}
			$sucesso=0;
			if ($ntrm!=0) {
				$sucesso=$ntrcm/$ntrm;
			}
			$line=$row['numero'].';'.$row['nome']. ';'.$row['turma'].';'.$nentradas.';'.$tempom.';'.$ntrm.';'.$sucesso.';23;23';
			$newarray[] = explode(';',trim($line));
			//print "vanumero$i=&vanome$i=&vaturma$i=$row[turma]&vaentrada$i=$nentradas&vatempo$i=$tempom&vantr$i=$ntrm&vantrc$i=$ntrcm&exmea$i=$exame1&ntaea$i=$notam1&idal$i=$row[user]";	 
      }
   }
   return $newarray;
}
?>
