<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", () => { 
        let alerts = document.getElementById('alertsDropdown');
        alerts.addEventListener('click', () =>{
            let count = document.getElementById('notifCount');
            count.remove();
            
            var userID = document.getElementById('userID');
            var status = true;
            var classesNodeList = document.querySelectorAll(".formID");
            var values = Array.prototype.map.call(classesNodeList, function(element) {
            return element.value;
            });

            console.log(values);

            //var r = new XMLHttpRequest(); 
            //r.open("POST", "/webservice", true);
            //r.onreadystatechange = function () {
              //  if (r.readyState != 4 || r.status != 200) return; 
                //console.log(r.responseText);
            //};
            //r.send({
               // userID: userID,
               // status: status;
            //});
            $.ajax({
                url: '/updateNotif',
                method: 'POST',
                data: {
                    userID: userID,
                    formIds: values,
                    status: status
                },
                success: function(data) {
                    console.log("success!");
                }
            });
        });
    });
</script>