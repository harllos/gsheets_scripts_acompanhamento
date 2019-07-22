function obter_localizacao_atual() {
    // esta função pega todas tipos selecionados de proposições (PEC, PL, PDL, PDC, PLD) 
    // em que Molon figura como autor 1 (autor principal/primeiro autor)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet_proposicoes = ss.getSheetByName('Dados');
  
    var linhas_preenchidas= sheet_proposicoes.getRange("A2:A").getValues();
    var linhas_preenchidas_filtered = linhas_preenchidas.filter(String).map(String);
    var linhas_preenchidas_filtradas_length = linhas_preenchidas.filter(String).length;
    
    var lista_ids = sheet_proposicoes.getRange('N2:N').getValues();
    var lista_ids_number = lista_ids.filter(String).map(Number);
   
    var startRow = 2;
    var numero_linhas = sheet_proposicoes.getRange("A2:A").getValues().filter(String).length;
    
    var Cvals = sheet_proposicoes.getRange("A2:A"+(numero_linhas+2)).getValues();
    var Cvals_filtrada = Cvals.filter(String).map(String);
      
    //Logger.log(lista_ids_number);
    
    for(var i = 0; i < lista_ids_number.length; i++){
      
      var sigla = linhas_preenchidas_filtered[i].split(' ')[0];
      var numero_ano = linhas_preenchidas_filtered[i].split(' ')[1];
      var numero = numero_ano.split('/')[0];
      var ano = numero_ano.split('/')[1];
      
      // call the api for PEC, PL, PDL, PDC, PLP by Molon
      var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes?sigla='+sigla+'&numero='+numero+'&ano='+ano+'&datApresentacaoIni=&datApresentacaoFim=&parteNomeAutor=&idTipoAutor=&siglaPartidoAutor=&siglaUFAutor=&generoAutor=&codEstado=&codOrgaoEstado=&emTramitacao=1');
      var document = XmlService.parse(url);
      var root = document.getRootElement();
       // definindo as variáveis para pegar da api
      var proposicao = root.getChildren();  
   //   Logger.log(proposicao);
    //  Logger.log(numero);
   //   Logger.log(sigla);
   //   Logger.log(ano);
      var localizacao_atual = proposicao[0].getChild('situacao').getChild('orgao').getChild('siglaOrgaoEstado').getValue();
      //populate sheet with variable data
      Logger.log(localizacao_atual);
      //procura última linha preenchida com base na coluna P (id)
      sheet_proposicoes.getRange(startRow+i,7).setValue([localizacao_atual]);
  
  
      }}
  