function checa_pauta() {
  
  //inicia e seleciona a planilha "Comissões
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet_comissoes = ss.getSheetByName('Comissões');
  var sheet_proposicoes = ss.getSheetByName('Proposições');
  
  //quero o número de comissões para o loop a seguir
  var Cvals = sheet_comissoes.getRange("C2:C").getValues();
  var Clast = Cvals.filter(String).length;
  var id_comissao = Cvals.filter(String);
 
  //pegando lista de proposições
  var Dvals = sheet_proposicoes.getRange("D3:D").getValues();
  var Dlast = Dvals.filter(String);
  var lista_de_proposicoes = Dlast.map(Number);


  //declara data de hoje
  var date = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy");
  //Logger.log(date);
  
  //var date = "12/03/2019";
  
 for (i=0; i<Clast; i++){
    // call the api
  var url = UrlFetchApp.fetch('https://www.camara.leg.br/SitCamaraWS/Orgaos.asmx/ObterPauta?IDOrgao='+id_comissao[i]+'&datIni='+date+'&datFim='+date);
  var document = XmlService.parse(url);
  var root = document.getRootElement().getChildren();  
  
  //esse loop existe porque pode haver mais de uma reunião em uma comissão
  for (j=0; j<root.length;j++){
    var proposicoes = root[j].getChild('proposicoes').getChildren();

    //navega até as proposicoes de cada reunião para encontrar as IDs de cada proposição a ser debatida na comissão
    for (k = 0; k<proposicoes.length; k++){   
      if (proposicao !== null){
        var proposicao = proposicoes[k].getChild('idProposicao').getValue();
        //Logger.log(proposicao);
        if (lista_de_proposicoes.indexOf(parseInt(proposicao)) != -1){
          var sigla = proposicoes[k].getChild('sigla').getValue();
          var nome_comissao = root[j].getChild('comissao').getValue();
          var mensagem = 'O(A) '+sigla+' entrou na pauta da seguinte comissão: '+nome_comissao+'.' + '\n'+
         'Para ver mais, clique no link de tramitação no site da Câmara: '+'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao='+proposicao;
          MailApp.sendEmail('harllos@outlook.com', 'Acompanhamento: proposição em pauta', mensagem); 
        
      }
      
      }

      
    }}}};
