function send_email(sigla,numero,ano, andamento, situacao, email_responsavel_i, link_tramitacao){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var destinatario = "harllos@outlook.com";
  var subject = 'Alterações('+sigla+' '+numero+'/'+ano+')' ;
  var body = 'A(o) '+sigla+' '+numero+'/'+ano+' sofreu a seguinte alteração: '+ '\n'+
    '- '+ situacao + ';'+ '\n'+
    '- '+ andamento + '\n'+
    'Para ver mais, clique no link de tramitação no site da Câmara:' + link_tramitacao; 
  MailApp.sendEmail(destinatario+","+email_responsavel_i[0]+","+email_responsavel_i[1], subject, body);
  //MailApp.sendEmail(destinatario,subject, body); 
};
