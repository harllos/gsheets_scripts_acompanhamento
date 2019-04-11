function lista_comissoes() {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ss = sheet.getSheetByName('Comissões');

  // call the api
  var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Orgaos.asmx/ObterOrgaos');
  var document = XmlService.parse(url);
  var root = document.getRootElement().getChildren('orgao');
  
  for (var i = 0; i < root.length; i++) {
    
    // definindo as variáveis para pegar da api
    var person = root[i];
    var id = person.getAttribute('id').getValue();
    var sigla = person.getAttribute('sigla').getValue();  
    var comissao = person.getAttribute('descricao').getValue(); 
    
    //populate sheet with variable data
    ss.getRange(i+2,1).setValue([comissao]);
    ss.getRange(i+2,2).setValue([sigla]);
    ss.getRange(i+2,3).setValue([id]);
        
  }
}
