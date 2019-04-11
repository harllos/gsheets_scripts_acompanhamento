function obter_andamento() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Proposições');
  var startRow = 3;
  var numero_linhas = sheet.getRange(1,10).getValue();

  for (i = 0; i<numero_linhas; i++)  {
    var sigla = sheet.getRange(startRow+i,1).getValue();
    var numero = sheet.getRange(startRow+i,2).getValue();
    var ano = sheet.getRange(startRow+i,3).getValue();
 
    // call the api
    var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Orgaos.asmx/ObterAndamento?sigla='+sigla+'&numero='+numero+'&ano='+ano+'&dataIni=01/01/2009&codOrgao=');
    var document = XmlService.parse(url);
    var root = document.getRootElement();
    

    // definindo as variáveis para pegar da api
    var proposicao = root.getAttributes();
    var ementa = root.getChild('ementa').getText();
    var situacao = root.getChild('situacao').getText();
    var id = root.getChild('idProposicao').getText();
    //definicao de andamento é diferente porque pode não ter tido nenhum andamento. por isso, pode dar erro "can't get getchild of null"
    var andamento = root.getChild('andamento').getChild('tramitacao');
    
    // verificar se estou pegando de fato as ultimas acoes!
    if (andamento === null){
      var andamento = "não houve andamentos";  
    } else{
      var andamento = root.getChild('ultimaAcao').getChild('tramitacao').getChild('descricao').getText();
    }

    //populate sheet with variable data
    sheet.getRange(startRow+i,4).setValue([id]);
    sheet.getRange(startRow+i,6).setValue([ementa]);
    sheet.getRange(startRow+i,9).setValue([situacao]);
    sheet.getRange(startRow+i,10).setValue([andamento]);

    // chamando outro link a partir do ID que conseguimos com a url anterior
    var numero_id = sheet.getRange(startRow+i,4).getValue();
    var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ObterProposicaoPorID?IdProp='+numero_id);
    var document = XmlService.parse(url);
    var root = document.getRootElement();
    
    var proposicao = root.getAttributes();
    var autor = root.getChild('Autor').getText();
    var partido = root.getChild('partidoAutor').getText();
    var uf = root.getChild('ufAutor').getText();
    var regime_tramitacao = root.getChild('RegimeTramitacao').getText();
    var apreciacao = root.getChild('Apreciacao').getText();
    var link_inteiro_teor = root.getChild('LinkInteiroTeor').getText();
    var link_tramitacao = 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao='+numero_id;
    
    sheet.getRange(startRow+i,5).setValue([autor+', '+partido+', '+ uf]);
    sheet.getRange(startRow+i,7).setValue([apreciacao]);
    sheet.getRange(startRow+i,8).setValue([regime_tramitacao]);
    sheet.getRange(startRow+i,16).setValue([link_tramitacao]);
    sheet.getRange(startRow+i,15).setValue([link_inteiro_teor]);
   
    
  }
}
