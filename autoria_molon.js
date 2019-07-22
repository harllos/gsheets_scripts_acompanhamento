function autoria_molon() {
    // esta função pega todas tipos selecionados de proposições (PEC, PL, PDL, PDC, PLD) 
    // em que Molon figura como autor 1 (autor principal/primeiro autor)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet_proposicoes = ss.getSheetByName('Dados');
  
    var linhas_preenchidas= sheet_proposicoes.getRange("A2:A").getValues();
    var linhas_preenchidas_filtradas_length = linhas_preenchidas.filter(String).length;
    
    var lista_ids = sheet_proposicoes.getRange('N2:N').getValues();
    var lista_ids_number = lista_ids.filter(String).map(Number);
    
    // call the api for PEC, PL, PDL, PDC, PLP by Molon
    var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes?sigla=PEC,PL,PDL,PDC,PLP&numero=&ano=&datApresentacaoIni=&datApresentacaoFim=&parteNomeAutor=molon&idTipoAutor=&siglaPartidoAutor=&siglaUFAutor=&generoAutor=&codEstado=&codOrgaoEstado=&emTramitacao=1');
    var document = XmlService.parse(url);
    var root = document.getRootElement();
      
    // definindo as variáveis para pegar da api
    var proposicoes = root.getChildren();  
    //Logger.log(lista_ids_number);
    
    for(var i = 0; i < proposicoes.length; i++){
      var id = proposicoes[i].getChild('id').getValue();
      var checar_tramitacao = proposicoes[i].getChild('situacao').getChild('descricao').getValue();
      //Logger.log(checar_tramitacao);
      //923 é o id de situacao arquivada
      if ((lista_ids_number.indexOf(parseFloat(id)) == -1) && (checar_tramitacao != 'Arquivada')) {
  
        var nome =  proposicoes[i].getChild('nome').getValue();
        var ementa = proposicoes[i].getChild('txtEmenta').getValue();
        var apreciacao = proposicoes[i].getChild('apreciacao').getChild('txtApreciacao').getValue();
        var situacao = proposicoes[i].getChild('situacao').getChild('descricao').getValue();
        var andamento = proposicoes[i].getChild('situacao').getChild('descricao').getValue();
        var localizacao_atual = proposicoes[i].getChild('situacao').getChild('orgao').getChild('siglaOrgaoEstado').getValue();
        var regime_tramitacao = proposicoes[i].getChild('regime').getChild('txtRegime').getValue(); 
        var link_tramitacao = 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao='+id;
        
   
        //populate sheet with variable data
          
        //procura última linha preenchida com base na coluna P (id)
        var Avals = sheet_proposicoes.getRange("A:A").getValues();
        var Alast = Avals.filter(String).length;
        Logger.log(Alast);
        Logger.log(nome);
        
        sheet_proposicoes.getRange(Alast+1,1).setValue([nome]);
        sheet_proposicoes.getRange(Alast+1,2).setValue([ementa]);
        sheet_proposicoes.getRange(Alast+1,3).setValue([apreciacao]);
        sheet_proposicoes.getRange(Alast+1,4).setValue([regime_tramitacao]);
        sheet_proposicoes.getRange(Alast+1,5).setValue([situacao]);
        sheet_proposicoes.getRange(Alast+1,6).setValue([andamento]);
        sheet_proposicoes.getRange(Alast+1,7).setValue([localizacao_atual]);
        sheet_proposicoes.getRange(Alast+113).setValue([link_tramitacao]);
        sheet_proposicoes.getRange(Alast+114).setValue([id]);
           
        MailApp.sendEmail('harllosarthur@gmail.com','Nova proposição adicionada à planilha', 'Nova proposição de autoria do Molon foi adicionada automaticamente à planilha.');
  
        }}}
  