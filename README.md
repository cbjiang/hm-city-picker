# hm-city-picker v1.0.0 #

It's based on jQuery UI 1.11.2 and Twitter Bootstrap 3.3.2.

## demo ##

### multi-city-picker ###

    <div id="divId" data-toggle="multi-city-picker"></div>
    <script>
      $('#divId').multicitypicker({
          citypicker:{
              placeholder: '请选择省/市/区，并填写详细地址',
              level: 'detail',//province,city,district,detail
          },
          limitSize:2,
      });
    </script>
    

### city-picker ###

    <input id="inputId" class="form-control" readonly type="text" data-toggle="city-picker">
    <input id="inputId2" class="form-control" readonly type="text" data-toggle="city-picker-detail">
    <script>
      $("#inputId").citypicker({
          placeholder: '请选择省/市/区，并填写详细地址',
          level: 'detail',//province,city,district,detail
      });
    </script>

## 
