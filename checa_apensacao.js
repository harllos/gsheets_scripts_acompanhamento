function checa_apensacao() {

    //esta função checa se as proposicoes presentes na planilha foram apensadas a alguma outra
    //se alguma proposicão tiver sido apensada, imprime na última linha da planilha principal a proposical principal
    //envia email caso haja apensação
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet_proposicoes = ss.getSheetByName('Dados');
    
    // lista de proposições
    var lista_de_proposicoes = sheet_proposicoes.getRange("A2:A").getValues();
    var lista_de_proposicoes_filtrada = lista_de_proposicoes.filter(String).map(String);
    
    // lista de ids
    var lista_ids = sheet_proposicoes.getRange('N2:N').getValues();
    var lista_ids_number = lista_ids.filter(String).map(Number);
    
    for(var i = 0; i < lista_de_proposicoes_filtrada.length; i++){
        
      var sigla = lista_de_proposicoes_filtrada[i].split(' ')[0];
      var numero_ano = lista_de_proposicoes_filtrada[i].split(' ')[1];
      var numero = numero_ano.split('/')[0];
      var ano = numero_ano.split('/')[1];
  
      var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes?sigla='+sigla+'&numero='+numero+'&ano='+ano+'&datApresentacaoIni=&datApresentacaoFim=&parteNomeAutor=&idTipoAutor=&siglaPartidoAutor=&siglaUFAutor=&generoAutor=&codEstado=&codOrgaoEstado=&emTramitacao=');
      var document = XmlService.parse(url);
      var root = document.getRootElement().getChildren();
      
      var principal_id = root[0].getChild('situacao').getChild('principal').getChild('codProposicaoPrincipal').getValue();
      
      //se a proposicao estiver apensada, haverá um código diferente de 0 em codProposicaoPrincipal.
      //assim, o loop while abaixo itera enquanto esse código não for 0
      //quando chega no 0, imprime uma linha na tabela
      while (principal_id != 0){
        var nome_proposicao = root[0].getChild('situacao').getChild('principal').getChild('proposicaoPrincipal').getValue();
        var sigla_i = nome_proposicao.split(' ')[0];
        var numero_ano = nome_proposicao.split(' ')[1]
        var numero_i = numero_ano.split('/')[0];
        var ano_i = numero_ano.split('/')[1];
        
        var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes?sigla='+sigla_i+'&numero='+numero_i+'&ano='+ano_i+'&datApresentacaoIni=&datApresentacaoFim=&parteNomeAutor=&idTipoAutor=&siglaPartidoAutor=&siglaUFAutor=&generoAutor=&codEstado=&codOrgaoEstado=&emTramitacao=');
        var document = XmlService.parse(url);
        var root = document.getRootElement().getChildren();
        
        var principal_id = root[0].getChild('situacao').getChild('principal').getChild('codProposicaoPrincipal').getValue();
        var principal_id_unico = root[0].getChild('id').getValue();
        //Logger.log(principal_id);
        // abaixo, quando chega na proposicao principal (quando codProposicaoPrincipal == 0), insere uma linha na tabela
        if ((principal_id == 0) && ((lista_ids_number.indexOf(parseFloat(principal_id_unico)) == -1))){
          console.log(principal_id_unico);
          var Avals = sheet_proposicoes.getRange("A:A").getValues();
          var Alast = Avals.filter(String).length;
          //Logger.log(Alast);
          sheet_proposicoes.getRange(Alast+1,1).setValue([nome_proposicao]);
          sheet_proposicoes.getRange(Alast+1,14).setValue([principal_id_unico]);
          sheet_proposicoes.getRange(Alast+1,15).setValue([sigla+' '+numero+'/'+ano]);
          
          MailApp.sendEmail('harllosarthur@gmail.com', '#MolonProposições - Nova apensação', 'Nova proposição apensada e adicionada à planilha para acompanhamento: https://docs.google.com/spreadsheets/d/1DJ1Mkct0t8WACDzCmJH9psLFeIVV3guPTV50y0cFqBw/edit#gid=0');
        }}
      }
  }
  
  