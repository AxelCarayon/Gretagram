$(document).ready(function () {

    function getFormData($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    $('#codeForm').submit(function (e) {
        e.preventDefault();
        var datas = getFormData($('#codeForm'));
        console.log(datas.username);
        console.log(datas.password);

        if (datas.username != "" && datas.password != "") {
            $.ajax({
                url: "",
                method: "post",
                data: datas,
                success : (data)=>{
                    console.log(data);
                },
                error : erreurIdentifiant(msg)

            });
        }else{
            $('.error2').css("display","block");
        }

    })

    function erreurIdentifiant (msg){

    }
});