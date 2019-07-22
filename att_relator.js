function att_relator(){

    // função que atualiza coluna ultimo_relator
    //utiliza a versão 2 da API
    //json
  
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet_proposicoes = ss.getSheetByName('Dados');
    var startRow = 2;
    var numero_linhas = sheet_proposicoes.getRange("A2:A").getValues().filter(String).length;
    
    
    var linhas_preenchidas= sheet_proposicoes.getRange("A2:A").getValues();
    var linhas_preenchidas_filtered = linhas_preenchidas.filter(String).map(String);
    var linhas_preenchidas_filtradas_length = linhas_preenchidas.filter(String).length;
    
    var lista_ids = sheet_proposicoes.getRange('N2:N').getValues();
    var lista_ids_number = lista_ids.filter(String).map(Number);
    
    var Cvals = sheet_proposicoes.getRange("A2:A"+(numero_linhas+2)).getValues();
    var Cvals_filtrada = Cvals.filter(String).map(String);
  
  
    for (i = 0; i<Cvals.length; i++){
      var id = lista_ids[i];
      var url = 'https://dadosabertos.camara.leg.br/api/v2/proposicoes/'+id;
      var response = UrlFetchApp.fetch(url); // get api endpoint
      var json = response.getContentText(); // get the response content as text
      var data = JSON.parse(json); //parse text into json
    
      //retorna uma url  
      var ultimo_relator = data['dados']['statusProposicao']['uriUltimoRelator'];
      
      if (ultimo_relator != null){
        var response = UrlFetchApp.fetch(ultimo_relator); // get api endpoint
        var json = response.getContentText(); // get the response content as text
        var data = JSON.parse(json); //parse text into json
        var nome_ultimo_relator = data['dados']['ultimoStatus']['nomeEleitoral'];
        var partido = data['dados']['ultimoStatus']['siglaPartido'];
        Logger.log(nome_ultimo_relator); //log data to logger to check
        
        sheet_proposicoes.getRange(startRow+i,8).setValue([nome_ultimo_relator+"("+partido+")"]);
      }else {
        var caption = "sem informações de relator";
        sheet_proposicoes.getRange(startRow+i,8).setValue([caption]);
  
        
        
  }
    }}