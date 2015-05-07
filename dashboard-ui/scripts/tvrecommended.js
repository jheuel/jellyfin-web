﻿(function ($, document) {

    function reload(page) {

        var context = '';

        if (LibraryMenu.getTopParentId()) {

            $('.scopedLibraryViewNav', page).show();
            $('.globalNav', page).hide();
            $('.scopedContent', page).show();
            context = 'tv';
            $('.nextUpHeader', page).removeClass('firstListHeader');

            loadResume(page);

        } else {
            $('.scopedLibraryViewNav', page).hide();
            $('.globalNav', page).show();
            $('.scopedContent', page).hide();
            $('.nextUpHeader', page).addClass('firstListHeader');
        }

        loadNextUp(page, context || 'home-nextup');
    }

    function loadNextUp(page, context) {

        var limit = AppInfo.hasLowImageBandwidth ?
         18 :
         24;

        var query = {

            Limit: limit,
            Fields: "PrimaryImageAspectRatio,SeriesInfo,DateCreated,SyncInfo",
            UserId: Dashboard.getCurrentUserId(),
            ExcludeLocationTypes: "Virtual",
            ImageTypeLimit: 1,
            EnableImageTypes: "Primary,Backdrop,Banner,Thumb"
        };

        query.ParentId = LibraryMenu.getTopParentId();

        ApiClient.getNextUpEpisodes(query).done(function (result) {

            if (result.Items.length) {
                $('.noNextUpItems', page).hide();
            } else {
                $('.noNextUpItems', page).show();
            }

            $('#nextUpItems', page).html(LibraryBrowser.getPosterViewHtml({
                items: result.Items,
                shape: "backdrop",
                showTitle: true,
                showParentTitle: true,
                overlayText: false,
                context: context,
                lazy: true,
                preferThumb: true

            })).lazyChildren();

        });
    }

    function loadResume(page) {

        var parentId = LibraryMenu.getTopParentId();

        var options = {

            SortBy: "DatePlayed",
            SortOrder: "Descending",
            IncludeItemTypes: "Episode",
            Filters: "IsResumable",
            Limit: 6,
            Recursive: true,
            Fields: "PrimaryImageAspectRatio,SeriesInfo,UserData,SyncInfo",
            ExcludeLocationTypes: "Virtual",
            ParentId: parentId,
            ImageTypeLimit: 1,
            EnableImageTypes: "Primary,Backdrop,Banner,Thumb"
        };

        ApiClient.getItems(Dashboard.getCurrentUserId(), options).done(function (result) {

            if (result.Items.length) {
                $('#resumableSection', page).show();
            } else {
                $('#resumableSection', page).hide();
                $('.nextUpHeader', page).addClass('firstListHeader');
            }

            $('#resumableItems', page).html(LibraryBrowser.getPosterViewHtml({
                items: result.Items,
                shape: "backdrop",
                showTitle: true,
                showParentTitle: true,
                overlayText: true,
                lazy: true,
                context: 'tv'

            })).lazyChildren();

        });
    }

    $(document).on('pagebeforeshow', "#tvRecommendedPage", function () {

        var page = this;

        reload(page);
    });


})(jQuery, document);