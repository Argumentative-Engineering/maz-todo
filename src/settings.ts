import $ from 'jquery';

export const renderSettings = () => {
    $("#btn-open-folder").on('click', function() {
        window.appAPI.openAppFolder();
    });
}
