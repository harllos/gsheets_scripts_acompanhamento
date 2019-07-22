function obter_andamento() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet_proposicoes = ss.getSheetByName('Dados');
  var lista_de_proposicoes = sheet_proposicoes.getActiveRange().getValues();
  var lista_de_proposicoes_filtrada = lista_de_proposicoes.filter(String).map(String);
  
  for (i = 0; i<lista_de_proposicoes_filtrada.length; i++)  {
    var sigla = lista_de_proposicoes_filtrada[i].split(' ')[0];
    var numero_ano = lista_de_proposicoes_filtrada[i].split(' ')[1];
    var numero = numero_ano.split('/')[0];
    var ano = numero_ano.split('/')[1];
 
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
    Logger.log(ementa);
    Logger.log(id);
    var row =  sheet_proposicoes.getActiveRange().getRowIndex();
    
    sheet_proposicoes.getRange(row+i,14).setValue([id]);
    sheet_proposicoes.getRange(row+i,2).setValue([ementa]);
    sheet_proposicoes.getRange(row+i,5).setValue([situacao]);
    sheet_proposicoes.getRange(row+i,6).setValue([andamento]);

    // chamando outro link a partir do ID que conseguimos com a url anterior
    var numero_id = sheet_proposicoes.getRange(row+i,14).getValue();
    var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ObterProposicaoPorID?IdProp='+numero_id);
    var document = XmlService.parse(url);
    var root = document.getRootElement();    
    var proposicao = root.getAttributes();
    var partido = root.getChild('partidoAutor').getText();
    var uf = root.getChild('ufAutor').getText();
    var regime_tramitacao = root.getChild('RegimeTramitacao').getText();
    var apreciacao = root.getChild('Apreciacao').getText();
    var link_tramitacao = 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao='+numero_id;

    sheet_proposicoes.getRange(row+i,3).setValue([apreciacao]);
    sheet_proposicoes.getRange(row+i,4).setValue([regime_tramitacao]);
    sheet_proposicoes.getRange(row+i,13).setValue([link_tramitacao]);
    

  }
}