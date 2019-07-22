function att_andamento() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Proposições');
  var startRow = 3;
  var numero_linhas = sheet.getRange(1,10).getValue();
  var Cvals = sheet.getRange("A3:C"+(numero_linhas+2)).getValues();
  var email_responsavel = sheet.getRange("N3:N"+(numero_linhas+2)).getValues();
  var andamento_existente = sheet.getRange("J3:J"+(numero_linhas+2)).getValues();
  var situacao_existente = sheet.getRange("I3:I"+(numero_linhas+2)).getValues();
  
  for (i = 0; i<Cvals.length; i++)  {
    var sigla = Cvals[i][0];
    var numero = Cvals[i][1];
    var ano = Cvals[i][2];
    var email_responsavel_i = email_responsavel[i][0].split(',');

    var andamento_existente_i = andamento_existente[i];
    var situacao_existente_i = situacao_existente[i];
    
    // call the api
    var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Orgaos.asmx/ObterAndamento?sigla='+sigla+'&numero='+numero+'&ano='+ano+'&dataIni=01/01/2009&codOrgao=');
    var document = XmlService.parse(url);
    var root = document.getRootElement();
    
    //definicao de andamento é diferente porque pode não ter tido nenhum andamento. por isso, pode dar erro "can't get getchild of null"
    var andamento = root.getChild('andamento').getChild('tramitacao');
    var situacao = root.getChild('situacao').getText();
    var id = root.getChild('idProposicao').getText();
    
    // verificar se estou pegando de fato as ultimas acoes!
    if (andamento === null){
      var andamento = "não houve andamentos";  
      
    } else if (andamento !== null){
      var andamento = root.getChild('ultimaAcao').getChild('tramitacao').getChild('descricao').getText();
      if (andamento != andamento_existente_i || situacao != situacao_existente_i){
        var link_tramitacao = 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao='+id;
        //send_email(sigla,numero,ano, andamento, situacao, email_responsavel_i, link_tramitacao);
        
    }else{
      var andamento = andamento_existente_i;
    } ;

    //populate sheet with variable data
    sheet.getRange(startRow+i,10).setValue([andamento]);
    sheet.getRange(startRow+i,9).setValue([situacao]);

    // chamando outro link a partir do ID que conseguimos com a url anterior
   // var numero_id = sheet.getRange(startRow+i,4).getValue();
    //var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ObterProposicaoPorID?IdProp='+numero_id);
    //var document = XmlService.parse(url);
    //var root = document.getRootElement();
      }
  }
}
