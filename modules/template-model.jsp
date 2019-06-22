<%if(models) {%><%for(var i = 0; i < models.length; i++) {%><%=`import ${models[i][0]} from './${models[i][0]}'\r\n`%><%}%><%}%>
export default <%= data %>
